import React, { useState, useMemo, useEffect } from 'react';
import { BLOG_POSTS } from './data';
import { BlogPost, Category } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import BlogCard from './components/BlogCard';
import BlogModal from './components/BlogModal';
import SkeletonCard from './components/SkeletonCard';
import CategoryFilter from './components/CategoryFilter';
import BackToTop from './components/BackToTop';
import ConsentModal from './components/ConsentModal';
import SettingsModal from './components/SettingsModal';
import SupportBanner from './components/SupportBanner';
import StaticPage, { PageType } from './components/StaticPage';
import InFeedAd from './components/InFeedAd';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { Analytics } from "@vercel/analytics/react";

const ITEMS_PER_PAGE = 6;
type ViewState = 'home' | PageType;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // Support Banner Logic
  const [showSupportBanner, setShowSupportBanner] = useState(false);
  
  // Analytics Consent State: null = not answered, true = accepted, false = declined
  const [analyticsConsent, setAnalyticsConsent] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for existing consent
    const storedConsent = localStorage.getItem('eldrex_analytics_consent');
    if (storedConsent === 'true') {
      setAnalyticsConsent(true);
    } else if (storedConsent === 'false') {
      setAnalyticsConsent(false);
    }
  }, []);

  const handleConsent = (choice: boolean) => {
    setAnalyticsConsent(choice);
    localStorage.setItem('eldrex_analytics_consent', choice.toString());
  };

  const handleAnalyticsChange = (allowed: boolean) => {
    setAnalyticsConsent(allowed);
    localStorage.setItem('eldrex_analytics_consent', allowed.toString());
  };

  const handleOpenPreferences = () => {
     setSettingsOpen(true);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if input/textarea is focused
      if (['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement).tagName)) return;

      if (e.key === 'ArrowLeft') {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
      } else if (e.key === 'ArrowRight') {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
      } else if (e.key === 'Escape') {
        if (selectedPostId) {
            handleCloseModal();
        } else if (settingsOpen) {
            setSettingsOpen(false);
        } else if (currentView !== 'home') {
            handleNavigate('home');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, selectedPostId, settingsOpen, currentView]);

  // Simulate initial data load animation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(BLOG_POSTS.map(post => post.category)));
  }, []);

  const filteredPosts = useMemo(() => {
    const sorted = [...BLOG_POSTS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let result = sorted;

    if (selectedCategory !== 'All') {
      result = result.filter(post => post.category === selectedCategory);
    }
    
    if (searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return result;
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
    if (currentView !== 'home') setCurrentView('home');
  };

  const handleCategorySelect = (category: Category | 'All') => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePostClick = (id: number) => {
    setSelectedPostId(id);
    
    // Increment read count
    const currentCount = parseInt(localStorage.getItem('articles_read_count') || '0');
    const newCount = currentCount + 1;
    localStorage.setItem('articles_read_count', newCount.toString());

    // Show banner if read count > 5 and not dismissed this session
    const bannerDismissed = sessionStorage.getItem('support_banner_dismissed');
    if (newCount > 5 && !bannerDismissed) {
      setShowSupportBanner(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedPostId(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDismissBanner = () => {
    setShowSupportBanner(false);
    sessionStorage.setItem('support_banner_dismissed', 'true');
  };

  const handleNavigate = (page: PageType | 'home') => {
    setCurrentView(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPost = useMemo(() => 
    BLOG_POSTS.find(p => p.id === selectedPostId) || null, 
  [selectedPostId]);

  const popularPosts = useMemo(() => {
    return [...BLOG_POSTS].sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-100 bg-background/50 dark:bg-slate-900 selection:bg-ember-200 selection:text-ember-900 dark:selection:bg-ember-900 dark:selection:text-ember-100 transition-colors duration-300">
      <Header 
        onSearch={handleSearch} 
        searchTerm={searchTerm} 
        onOpenSettings={() => setSettingsOpen(true)} 
      />
      
      {/* Conditionally Render Analytics based on Consent */}
      {analyticsConsent === true && <Analytics />}

      {/* Show Consent Modal if no choice made */}
      <AnimatePresence>
        {analyticsConsent === null && (
          <ConsentModal 
            onAccept={() => handleConsent(true)} 
            onDecline={() => handleConsent(false)} 
          />
        )}
      </AnimatePresence>

      <SupportBanner isVisible={showSupportBanner} onClose={handleDismissBanner} />
      
      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.main 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
          >
            {/* Hero Section with GIF */}
            <div className="relative mb-16 sm:mb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl min-h-[400px] sm:min-h-[500px] flex items-center justify-center isolate border border-slate-800"
              >
                {/* Background GIF */}
                <div className="absolute inset-0 z-0 select-none">
                    <img 
                        src="https://eldrex.landecs.org/post/hero.gif" 
                        alt="Hero Background" 
                        className="w-full h-full object-cover opacity-60 dark:opacity-40 transform scale-105"
                    />
                    {/* Professional Overlay System */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <div className="flex justify-center mb-8">
                            <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/90 text-xs font-bold uppercase tracking-[0.25em] shadow-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-ember-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] animate-pulse" />
                                Personal Blog
                            </span>
                        </div>
                        
                        <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 tracking-tight leading-none drop-shadow-xl">
                          Thoughts & <br className="hidden sm:block" />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-ember-200 via-orange-100 to-white italic">Reflections</span>
                        </h2>
                        
                        <p className="text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-light tracking-wide drop-shadow-md opacity-90">
                          Exploring the intersection of humanity, technology, and personal growth through stories and experiences.
                        </p>
                    </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Category Filter */}
            <CategoryFilter 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleCategorySelect} 
            />

            {/* Blog Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 min-h-[400px]"
            >
              <AnimatePresence mode='popLayout'>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={`skeleton-${i}`} />
                  ))
                ) : currentPosts.length > 0 ? (
                  currentPosts.map((post, index) => (
                    <React.Fragment key={post.id}>
                      <BlogCard 
                        post={post} 
                        onClick={handlePostClick} 
                        index={index} 
                      />
                      {/* Inject Ad after 3rd item */}
                      {index === 2 && <InFeedAd />}
                    </React.Fragment>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-24 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 shadow-sm"
                  >
                    <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No stories found matching your criteria.</p>
                    <button 
                      onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }} 
                      className="mt-4 text-ember-600 dark:text-ember-400 font-bold hover:text-ember-700 dark:hover:text-ember-300 underline underline-offset-4 transition-colors"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-ember-200 hover:text-ember-600 dark:hover:text-ember-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-ember-500"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-11 h-11 rounded-xl text-sm font-bold transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-ember-500 ${
                      currentPage === page
                        ? 'bg-ember-600 text-white shadow-lg shadow-ember-200 dark:shadow-none ring-2 ring-ember-100 dark:ring-ember-900'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-ember-200 hover:text-ember-600 dark:hover:text-ember-400 shadow-sm hover:shadow'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-ember-200 hover:text-ember-600 dark:hover:text-ember-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-ember-500"
                  aria-label="Next page"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Popular Stories Section */}
            {!loading && (
              <div className="mt-32 pt-16 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                      <Sparkles size={20} fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100">
                    Popular Stories
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {popularPosts.map((post, idx) => (
                    <React.Fragment key={post.id}>
                      <motion.div 
                        whileHover={{ y: -4 }}
                        onClick={() => handlePostClick(post.id)}
                        className="group cursor-pointer flex gap-4 items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-ember-200 dark:hover:border-ember-700 hover:shadow-lg hover:shadow-ember-100/50 dark:hover:shadow-none transition-all duration-300 h-full"
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700 relative">
                          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10"/>
                          <img 
                            src={post.image || post.placeholderImage} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-ember-600 dark:text-ember-400 uppercase tracking-widest">{post.category}</span>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-ember-700 dark:group-hover:text-ember-400 transition-colors line-clamp-2 mt-1.5 leading-snug">
                            {post.title}
                          </h4>
                          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-medium">{post.date}</div>
                        </div>
                      </motion.div>
                      
                      {/* Inject Ad after 2nd popular story */}
                      {idx === 1 && (
                         <div className="h-full">
                           <InFeedAd className="min-h-[140px] h-full" showBadge={true} />
                         </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </motion.main>
        ) : (
          <StaticPage key={currentView} type={currentView} onBack={() => handleNavigate('home')} />
        )}
      </AnimatePresence>

      <Footer 
        onOpenPreferences={handleOpenPreferences} 
        onOpenSettings={() => setSettingsOpen(true)} 
        onNavigate={(page) => handleNavigate(page)}
      />
      <BackToTop />
      
      <BlogModal post={selectedPost} onClose={handleCloseModal} onSelectPost={handlePostClick} />
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        analyticsConsent={analyticsConsent}
        onAnalyticsChange={handleAnalyticsChange}
      />
    </div>
  );
};

export default App;
