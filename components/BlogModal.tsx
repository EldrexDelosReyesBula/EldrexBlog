import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { X, ArrowLeft, Share2, Calendar, Tag, ChevronUp, Coffee, BookOpen, Clock, Check, MoreVertical, Bookmark, Highlighter, Type, Star, Download, Eye, EyeOff, Volume2, VolumeX, ShieldAlert, Twitter, Facebook, Linkedin } from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data';
import { db, auth, trackEvent } from '../firebase';
import { collection, doc, setDoc, onSnapshot, query, where, getDocs, updateDoc, increment, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onSelectPost: (id: number) => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ post, onClose, onSelectPost }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [recommendations, setRecommendations] = useState<BlogPost[]>([]);
  const [copied, setCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [readMode, setReadMode] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selection, setSelection] = useState<{ text: string, x: number, y: number } | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const readingStartTime = useRef<number>(Date.now());
  const maxScroll = useRef<number>(0);

  // Analytics: Track reading time and ratio
  useEffect(() => {
    if (!post) return;
    readingStartTime.current = Date.now();
    maxScroll.current = 0;

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - readingStartTime.current) / 1000);
      const readingRatio = Math.min(100, Math.round(maxScroll.current * 100));
      
      trackEvent('post_read_stats', {
        post_id: post.id,
        post_title: post.title,
        time_spent_seconds: timeSpent,
        reading_ratio_percent: readingRatio
      });
    };

    return () => {
      handleBeforeUnload();
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [post]);

  const handleScrollDepth = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPercent = target.scrollTop / (target.scrollHeight - target.clientHeight);
    if (scrollPercent > maxScroll.current) {
      maxScroll.current = scrollPercent;
    }
    setIsScrolled(target.scrollTop > 50);
  };

  const toggleReadAloud = () => {
    if (isReadingAloud) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    } else {
      // Exclude specific post from Read Aloud
      if (post?.date === 'March 8, 2026') {
        return;
      }
      const text = contentRef.current?.innerText || '';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volume;
      utterance.onend = () => {
        setIsReadingAloud(false);
        setIsPaused(false);
      };
      speechRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsReadingAloud(true);
      setIsPaused(false);
      trackEvent('read_aloud_started', { post_id: post?.id });
    }
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    setIsReadingAloud(false);
    setIsPaused(false);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (speechRef.current) {
      // Note: Changing volume on a running utterance might not work in all browsers
      // but we update the state for the next start/resume
      speechRef.current.volume = newVolume;
    }
  };

  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().length > 0) {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setSelection({
        text: sel.toString(),
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    } else {
      setSelection(null);
    }
  };

  const handleHighlight = async (color: string) => {
    if (!post || !auth.currentUser || !selection) return;
    await setDoc(doc(collection(db, 'highlights')), {
      postId: post.id,
      userId: auth.currentUser.uid,
      text: selection.text,
      color: color,
      timestamp: serverTimestamp()
    });
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  // Firebase Real-time Listeners
  useEffect(() => {
    if (!post || !auth.currentUser) return;

    // Listen for ratings
    const ratingsQuery = query(collection(db, 'ratings'), where('postId', '==', post.id));
    const unsubscribeRatings = onSnapshot(ratingsQuery, (snapshot) => {
      const ratingsData = snapshot.docs.map(doc => doc.data());
      if (ratingsData.length > 0) {
        const sum = ratingsData.reduce((acc, curr) => acc + curr.rating, 0);
        setAvgRating(sum / ratingsData.length);
        setTotalRatings(ratingsData.length);
      }
      
      const userRating = ratingsData.find(r => r.userId === auth.currentUser?.uid);
      if (userRating) setRating(userRating.rating);
    });

    // Listen for saved state
    const savesQuery = query(collection(db, 'saves'), where('postId', '==', post.id), where('userId', '==', auth.currentUser.uid));
    const unsubscribeSaves = onSnapshot(savesQuery, (snapshot) => {
      setIsSaved(!snapshot.empty);
    });

    // Listen for highlights
    const highlightsQuery = query(collection(db, 'highlights'), where('postId', '==', post.id));
    const unsubscribeHighlights = onSnapshot(highlightsQuery, (snapshot) => {
      setHighlights(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeRatings();
      unsubscribeSaves();
      unsubscribeHighlights();
    };
  }, [post]);

  const handleRate = async (value: number) => {
    if (!post || !auth.currentUser) return;
    const ratingId = `${auth.currentUser.uid}_${post.id}`;
    await setDoc(doc(db, 'ratings', ratingId), {
      postId: post.id,
      userId: auth.currentUser.uid,
      rating: value,
      timestamp: serverTimestamp()
    });
    setRating(value);
  };

  const handleToggleSave = async () => {
    if (!post || !auth.currentUser) return;
    const saveId = `${auth.currentUser.uid}_${post.id}`;
    if (isSaved) {
      await deleteDoc(doc(db, 'saves', saveId));
    } else {
      await setDoc(doc(db, 'saves', saveId), {
        userId: auth.currentUser.uid,
        postId: post.id,
        timestamp: serverTimestamp()
      });
    }
  };

  const handleGenerateShareImage = async () => {
    if (!contentRef.current || !post) return;
    setIsGeneratingImage(true);
    
    try {
      // Create a temporary container to hold the content for capturing
      // This helps in capturing the full height without scrollbars
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
        scale: 3, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: 800,
        height: contentRef.current.scrollHeight,
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById('blog-content-area');
          if (element) {
            element.style.height = 'auto';
            element.style.overflow = 'visible';
            element.style.width = '800px';
            element.style.padding = '60px 40px';
            element.style.borderRadius = '0'; // Keep it clean for full capture
            
            // Ensure all images are loaded in the clone
            const images = element.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
              images[i].style.display = 'block';
              images[i].style.maxWidth = '100%';
              images[i].style.borderRadius = '16px';
            }
          }
        }
      });
      
      const image = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `${post.title.replace(/\s+/g, '-').toLowerCase()}-full-preview.png`;
      link.click();
      
      trackEvent('generate_image_preview', { post_id: post.id, type: 'full' });
    } catch (error) {
      console.error('Error generating image preview:', error);
    } finally {
      setIsGeneratingImage(false);
      setShowOptions(false);
    }
  };

  useEffect(() => {
    if (post) {
      document.body.style.overflow = 'hidden';
      if (contentRef.current) contentRef.current.scrollTop = 0;
      setIsScrolled(false);
      
      // Reset post-specific states
      setRating(0);
      setAvgRating(0);
      setTotalRatings(0);
      setIsSaved(false);
      setHighlights([]);
      setReadMode(false);
      setIsReadingAloud(false);
      setIsPaused(false);

      const sameCategory = BLOG_POSTS.filter(p => p.category === post.category && p.id !== post.id);
      const others = BLOG_POSTS.filter(p => p.category !== post.category && p.id !== post.id);
      const recs = [...sameCategory, ...others].slice(0, 3);
      setRecommendations(recs);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        setIsScrolled(contentRef.current.scrollTop > 50);
      }
    };
    
    const ref = contentRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (ref) {
        ref.removeEventListener('scroll', handleScroll);
      }
    };
  }, [post]);

  const handleRecommendationClick = (id: number) => {
    onSelectPost(id);
    if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'smooth'});
  };

  const handleShare = (platform?: 'twitter' | 'facebook' | 'linkedin') => {
    const shareUrl = window.location.href;
    const title = post?.title || 'Eldrex Blog';
    const text = post?.excerpt || '';

    if (!platform) {
      if (navigator.share) {
        navigator.share({ title, text, url: shareUrl }).catch(console.error);
      } else {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return;
    }

    let url = '';
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  const calculateReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const processedContent = useMemo(() => {
    if (!post) return '';
    let content = post.content;
    
    // Apply highlights directly in the text body
    if (highlights.length > 0) {
      // Sort highlights by length descending to avoid nested replacement issues
      const sortedHighlights = [...highlights].sort((a, b) => b.text.length - a.text.length);
      
      sortedHighlights.forEach(h => {
        // Use a regex to replace text, but avoid replacing inside HTML tags
        // This is a simplified approach
        const escapedText = h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedText})`, 'gi');
        
        // We only want to highlight if it's not already inside a mark tag or other sensitive tags
        // For simplicity, we'll just do a global replace for now as requested
        content = content.replace(regex, '<mark class="bg-brand-200/60 dark:bg-brand-500/40 rounded-sm px-0.5 cursor-help transition-colors hover:bg-brand-300/70 dark:hover:bg-brand-400/50" title="Community Highlight">$1</mark>');
      });
    }
    
    return content;
  }, [post, highlights]);

  if (!post) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col"
      >
        <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Header */}
            <div className={cn(
              "absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-all duration-500",
              isScrolled ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm" : "bg-transparent border-transparent"
            )}>
              <button
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-2 transition-all font-medium px-4 py-2 rounded-full active:scale-95",
                  isScrolled ? "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800" : "text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                )}
                aria-label="Back to home"
              >
                <ArrowLeft size={18} />
                <span className="text-sm font-bold">Back</span>
              </button>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleToggleSave}
                  className={cn(
                    "p-2.5 rounded-full transition-all active:scale-90",
                    isSaved ? "text-brand-500 bg-brand-50 dark:bg-brand-900/20" : isScrolled ? "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" : "text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                  )}
                  aria-label={isSaved ? "Unsave post" : "Save post"}
                >
                  <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className={cn(
                      "p-2.5 rounded-full transition-all active:scale-90",
                      isScrolled ? "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" : "text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                    )}
                    aria-label="More options"
                  >
                    <MoreVertical size={20} />
                  </button>

                  <AnimatePresence>
                    {showOptions && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-[var(--radius-m3-l)] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden z-30"
                      >
                        <div className="p-2">
                          <button
                            onClick={toggleReadAloud}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                          >
                            {isReadingAloud ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            {isReadingAloud ? 'Stop Reading' : 'Read Aloud'}
                          </button>
                          <button
                            onClick={() => { setReadMode(!readMode); setShowOptions(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
                          >
                            {readMode ? <EyeOff size={18} /> : <Eye size={18} />}
                            {readMode ? 'Exit Read Mode' : 'Read Mode'}
                          </button>
                          <div className="px-4 py-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Share on Social</span>
                            <div className="flex items-center gap-3 mt-2">
                              <button onClick={() => handleShare('twitter')} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:text-brand-500 transition-colors" title="Share on Twitter">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                              </button>
                              <button onClick={() => handleShare('facebook')} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:text-brand-500 transition-colors" title="Share on Facebook">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                              </button>
                              <button onClick={() => handleShare('linkedin')} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:text-brand-500 transition-colors" title="Share on LinkedIn">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454c.98 0 1.775-.773 1.775-1.729V1.729C24 .774 23.205 0 22.225 0z"/></svg>
                              </button>
                              <button onClick={() => handleShare()} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:text-brand-500 transition-colors" title="Copy Link">
                                {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
                              </button>
                            </div>
                          </div>
                          <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2" />
                          <button
                            onClick={handleGenerateShareImage}
                            disabled={isGeneratingImage}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors disabled:opacity-50"
                          >
                            <Download size={18} />
                            {isGeneratingImage ? 'Generating...' : 'Download Share Image'}
                          </button>
                          <div className="h-px bg-slate-100 dark:bg-slate-700 my-1 mx-2" />
                          <div className="px-4 py-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Text Size</span>
                            <div className="flex items-center gap-4 mt-2">
                              <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="text-slate-500 hover:text-brand-500">A-</button>
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{fontSize}px</span>
                              <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="text-slate-500 hover:text-brand-500">A+</button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Content */}
            <div 
              ref={contentRef}
              id="blog-content-area"
              onScroll={handleScrollDepth}
              className="flex-1 overflow-y-auto scroll-smooth bg-white dark:bg-slate-900"
              tabIndex={0}
            >
              {/* Read Aloud Control Bar */}
              <AnimatePresence>
                {isReadingAloud && (
                  <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6"
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={toggleReadAloud}
                        className="p-2 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition-colors"
                      >
                        {isPaused ? <Volume2 size={20} /> : <VolumeX size={20} />}
                      </button>
                      <button 
                        onClick={stopReading}
                        className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                    
                    <div className="flex items-center gap-3">
                      <Volume2 size={16} className="text-slate-400" />
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="w-24 accent-brand-500"
                      />
                    </div>
                    
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                      </span>
                      {isPaused ? 'Paused' : 'Reading'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Hero Image */}
              {!readMode && (
                <div className="w-full h-[45vh] md:h-[60vh] relative group">
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
                  <img
                    src={post.image || post.placeholderImage}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16 max-w-4xl mx-auto text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-medium text-white/90">
                        <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-lg px-3 py-1 rounded-full border border-white/10 text-white">
                          <Tag size={12} /> {post.category}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-brand-400" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-brand-400" /> {calculateReadingTime(post.content)} min read
                        </span>
                      </div>
                      <h1 id="modal-title" className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif leading-[1.1] tracking-tight drop-shadow-sm mb-4">
                        {post.title}
                      </h1>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Body */}
              <div className={cn(
                "max-w-3xl mx-auto px-6 py-16 sm:px-8 transition-all duration-500",
                readMode && "max-w-4xl bg-slate-50 dark:bg-slate-800/50 rounded-[var(--radius-m3-xl)] my-8 shadow-inner pt-24"
              )}>
                {readMode && (
                  <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white mb-4">
                      {post.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{calculateReadingTime(post.content)} min read</span>
                    </div>
                  </div>
                )}
                {/* Rating Section */}
                <div className="flex items-center justify-between mb-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[var(--radius-m3-l)] border border-slate-100 dark:border-slate-700">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Rate this story</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRate(star)}
                            className={cn(
                              "transition-all active:scale-90",
                              (rating || 0) >= star ? "text-yellow-400" : "text-slate-300 dark:text-slate-600 hover:text-yellow-200"
                            )}
                          >
                            <Star size={20} fill={(rating || 0) >= star ? "currentColor" : "none"} />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-500">({totalRatings} ratings)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-serif font-bold text-brand-500">{avgRating.toFixed(1)}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Rating</div>
                  </div>
                </div>

                <article 
                  onMouseUp={handleMouseUp}
                  style={{ fontSize: `${fontSize}px` }}
                  className={cn(
                    "prose prose-lg prose-slate dark:prose-invert prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-8 prose-p:font-light prose-blockquote:border-l-4 prose-blockquote:border-brand-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-200 prose-blockquote:font-serif prose-blockquote:bg-brand-50/50 dark:prose-blockquote:bg-brand-900/10 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg hover:prose-blockquote:border-brand-600 transition-colors prose-strong:text-brand-700 dark:prose-strong:text-brand-400 prose-strong:font-bold prose-a:text-brand-600 dark:prose-a:text-brand-400 hover:prose-a:text-brand-700 dark:hover:prose-a:text-brand-300 hover:prose-a:underline-offset-4 max-w-none first-letter:text-5xl first-letter:font-bold first-letter:font-serif first-letter:text-brand-600 dark:first-letter:text-brand-400 first-letter:mr-3 first-letter:float-left",
                    readMode && "prose-xl"
                  )}
                >
                  <div dangerouslySetInnerHTML={{ __html: processedContent }} />
                  
                  {/* Copyright Notice */}
                  {post.copyright && (
                    <div className="mt-12 p-6 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl not-prose">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
                          <ShieldAlert size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Copyright Information</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                            The written content of this article is the intellectual property of Eldrex Delos Reyes Bula. 
                            Some visual assets used are property of their respective owners and are used here under Fair Use principles.
                          </p>
                          <button 
                            onClick={() => {
                              onClose();
                              // We need a way to navigate to the copyright page.
                              // Since App.tsx handles navigation, we'll use a custom event or a prop.
                              // For now, let's assume we can trigger it via a window event or similar if needed,
                              // but better to pass a prop.
                              window.dispatchEvent(new CustomEvent('navigate-to-page', { detail: 'copyright' }));
                            }}
                            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline underline-offset-4"
                          >
                            View Full Copyright & Credits
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render Highlights */}
                  <div className="mt-8 space-y-4">
                    {highlights.length > 0 && (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Highlighter size={14} /> Community Highlights
                        </h5>
                        <div className="space-y-3">
                          {highlights.map((h) => (
                            <div key={h.id} className="text-sm italic text-slate-600 dark:text-slate-400 border-l-2 border-brand-500 pl-4 py-1">
                              "{h.text}"
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>

                {/* Highlight Tooltip */}
                <AnimatePresence>
                  {selection && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: -50, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      style={{ position: 'fixed', left: selection.x, top: selection.y, transform: 'translateX(-50%)' }}
                      className="z-[60] flex items-center gap-1 bg-slate-900 text-white px-2 py-1.5 rounded-full shadow-2xl border border-white/10"
                    >
                      <button onClick={() => handleHighlight('yellow')} className="p-1.5 hover:bg-white/10 rounded-full text-yellow-400"><Highlighter size={16} /></button>
                      <button onClick={() => handleHighlight('pink')} className="p-1.5 hover:bg-white/10 rounded-full text-pink-400"><Highlighter size={16} /></button>
                      <button onClick={() => handleHighlight('blue')} className="p-1.5 hover:bg-white/10 rounded-full text-blue-400"><Highlighter size={16} /></button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Author Bio */}
                <section className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6" aria-label="Author information">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-md">
                        <img 
                            src="https://eldrex.landecs.org/squad/eldrex.png" 
                            alt="Eldrex Delos Reyes Bula" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="font-serif font-bold text-slate-900 dark:text-white text-lg">Eldrex Delos Reyes Bula</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                            A curious mind exploring the intersection of technology, humanity, and storytelling. Building digital experiences that matter.
                        </p>
                    </div>
                </section>

                {/* Support Card */}
                <section className="my-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/50 border border-brand-100 dark:border-slate-700 p-8 sm:p-12 text-center group" aria-label="Support the author">
                   <div className="relative z-10 flex flex-col items-center">
                       <div className="bg-white dark:bg-slate-700 p-4 rounded-full shadow-md mb-6 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
                           <Coffee size={32} />
                       </div>
                       <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-3">Enjoying the read?</h3>
                       <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md leading-relaxed">
                         If you found value in these words, your support helps me continue sharing stories and reflections.
                       </p>
                       <a 
                         href='https://ko-fi.com/landecsorg' 
                         target='_blank' 
                         rel="noopener noreferrer"
                         className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-600 dark:bg-brand-600 text-white font-bold rounded-full hover:bg-brand-700 dark:hover:bg-brand-500 transition-all shadow-xl hover:shadow-2xl hover:shadow-brand-500/30 hover:-translate-y-1"
                         aria-label="Support Eldrex on Ko-fi"
                       >
                         <span>Support on Ko-fi</span>
                       </a>
                   </div>
                   {/* Decorative circle */}
                   <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-100/50 dark:bg-brand-900/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" aria-hidden="true" />
                   <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-100/50 dark:bg-brand-900/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" aria-hidden="true" />
                </section>

                {/* Related Posts */}
                <section className="pt-12 border-t border-slate-200 dark:border-slate-800" aria-label="Related stories">
                   <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                     <BookOpen className="text-slate-400" size={24} aria-hidden="true" />
                     Related Posts
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {recommendations.map((rec) => (
                        <div 
                          key={rec.id}
                          onClick={() => handleRecommendationClick(rec.id)}
                          className="group cursor-pointer flex flex-col h-full"
                          role="button"
                          tabIndex={0}
                          aria-label={`Read related story: ${rec.title}`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleRecommendationClick(rec.id);
                            }
                          }}
                        >
                          <div className="h-40 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 border border-slate-100 dark:border-slate-700 relative">
                            <img 
                              src={rec.image || rec.placeholderImage} 
                              alt=""
                              aria-hidden="true"
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                          </div>
                          <div className="flex flex-col flex-grow">
                              <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">{rec.category}</span>
                              <h4 className="text-sm font-bold font-serif text-slate-900 dark:text-slate-100 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors leading-snug line-clamp-2">
                                {rec.title}
                              </h4>
                          </div>
                        </div>
                     ))}
                   </div>
                </section>

                <div className="mt-20 flex justify-center">
                   <button 
                     onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth'})}
                     className="group flex flex-col items-center gap-3 text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                     aria-label="Scroll back to top of the article"
                   >
                     <div className="p-3 rounded-full border border-slate-200 dark:border-slate-700 group-hover:border-slate-900 dark:group-hover:border-slate-200 transition-colors">
                        <ChevronUp size={20} />
                     </div>
                     <span className="text-xs font-semibold uppercase tracking-widest">Back to Top</span>
                   </button>
                </div>
              </div>
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogModal;
