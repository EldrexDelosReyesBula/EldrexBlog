import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Share2, Calendar, Tag, ChevronUp, Coffee, BookOpen, Clock, Check } from 'lucide-react';
import { BlogPost } from '../types';
import { BLOG_POSTS } from '../data';
import InFeedAd from './InFeedAd';

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

  useEffect(() => {
    if (post) {
      document.body.style.overflow = 'hidden';
      if (contentRef.current) contentRef.current.scrollTop = 0;
      setIsScrolled(false);
      
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

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculateReadingTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / 200);
  };

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
        >
            {/* Header */}
            <div className={`absolute top-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm' : 'bg-transparent border-transparent'}`}>
              <button
                onClick={onClose}
                className={`group flex items-center gap-2 transition-colors font-medium px-3 py-1.5 rounded-full ${isScrolled ? 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800' : 'text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm'}`}
              >
                <div className={`p-1 rounded-full transition-colors ${isScrolled ? 'bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700' : 'bg-transparent'}`}>
                    <ArrowLeft size={16} />
                </div>
                <span className="text-sm font-semibold">Back</span>
              </button>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handleShare}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${copied ? 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400' : isScrolled ? 'text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20' : 'text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm'}`}
                >
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                  <span className="text-sm font-medium">{copied ? 'Copied' : 'Share'}</span>
                </button>
                <div className={`h-4 w-px ${isScrolled ? 'bg-slate-200 dark:bg-slate-700' : 'bg-white/20'}`} />
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm hover:text-red-400'}`}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div 
              ref={contentRef}
              className="flex-1 overflow-y-auto scroll-smooth bg-white dark:bg-slate-900"
            >
              {/* Hero Image */}
              <div className="w-full h-[45vh] md:h-[60vh] relative group">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
                <img
                  src={post.image || post.placeholderImage}
                  alt={post.title}
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
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif leading-[1.1] tracking-tight drop-shadow-sm mb-4">
                      {post.title}
                    </h1>
                  </motion.div>
                </div>
              </div>

              {/* Body */}
              <div className="max-w-3xl mx-auto px-6 py-16 sm:px-8">
                <article 
                  className="prose prose-lg prose-slate dark:prose-invert prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-8 prose-p:font-light prose-blockquote:border-l-4 prose-blockquote:border-brand-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-200 prose-blockquote:font-serif prose-blockquote:bg-brand-50/50 dark:prose-blockquote:bg-brand-900/10 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg hover:prose-blockquote:border-brand-600 transition-colors prose-strong:text-brand-700 dark:prose-strong:text-brand-400 prose-strong:font-bold prose-a:text-brand-600 dark:prose-a:text-brand-400 hover:prose-a:text-brand-700 dark:hover:prose-a:text-brand-300 hover:prose-a:underline-offset-4 max-w-none first-letter:text-5xl first-letter:font-bold first-letter:font-serif first-letter:text-brand-600 dark:first-letter:text-brand-400 first-letter:mr-3 first-letter:float-left"
                >
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {/* Author Bio */}
                <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6">
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
                </div>

                {/* Support Card */}
                <div className="my-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/50 border border-brand-100 dark:border-slate-700 p-8 sm:p-12 text-center group">
                   <div className="relative z-10 flex flex-col items-center">
                       <div className="bg-white dark:bg-slate-700 p-4 rounded-full shadow-md mb-6 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform duration-300">
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
                       >
                         <span>Support on Ko-fi</span>
                       </a>
                   </div>
                   {/* Decorative circle */}
                   <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-100/50 dark:bg-brand-900/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-100/50 dark:bg-brand-900/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                </div>

                {/* Related Posts */}
                <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
                   <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                     <BookOpen className="text-slate-400" size={24} />
                     Related Posts
                   </h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {recommendations.map((rec, idx) => (
                       <React.Fragment key={rec.id}>
                          <div 
                            onClick={() => handleRecommendationClick(rec.id)}
                            className="group cursor-pointer flex flex-col h-full"
                          >
                            <div className="h-40 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 border border-slate-100 dark:border-slate-700 relative">
                              <img 
                                src={rec.image || rec.placeholderImage} 
                                alt={rec.title}
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
                          {/* Inject Ad after 2nd related post */}
                          {idx === 1 && <InFeedAd className="h-full min-h-[200px]" />}
                       </React.Fragment>
                     ))}
                   </div>
                </div>

                <div className="mt-20 flex justify-center">
                   <button 
                     onClick={() => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth'})}
                     className="group flex flex-col items-center gap-3 text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
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