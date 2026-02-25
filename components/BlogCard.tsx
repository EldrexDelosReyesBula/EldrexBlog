import React, { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
  onClick: (id: number) => void;
  index: number;
}

const calculateReadingTime = (content: string) => {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(words / 200);
};

const BlogCard = forwardRef<HTMLElement, BlogCardProps>(({ post, onClick, index }, ref) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
      className="group flex flex-col h-full cursor-pointer"
      onClick={() => onClick(post.id)}
    >
      <div className="relative h-64 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 mb-5 shadow-sm border border-slate-100/50 dark:border-slate-700/50 group-hover:shadow-xl group-hover:shadow-slate-200/50 dark:group-hover:shadow-black/50 transition-all duration-500">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse z-10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 z-10 transition-opacity duration-300 group-hover:opacity-40"/>
        
        <img
          src={post.image || post.placeholderImage}
          alt={post.title}
          className={`w-full h-full object-cover transform group-hover:scale-110 transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
        />
        
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-slate-100 shadow-sm tracking-wide uppercase">
            {post.category}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-grow px-1">
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-3 tracking-wide uppercase">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-brand-500" />
            {post.date}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-brand-500" />
            {calculateReadingTime(post.content)} min read
          </div>
        </div>

        <h3 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-3 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 text-[15px] leading-relaxed mb-6 line-clamp-3 flex-grow font-light">
          {post.excerpt}
        </p>

        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          <span className="border-b-2 border-slate-100 dark:border-slate-700 group-hover:border-brand-200 dark:group-hover:border-brand-800 pb-0.5 transition-all">Read Story</span>
          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.article>
  );
});

BlogCard.displayName = 'BlogCard';

export default BlogCard;