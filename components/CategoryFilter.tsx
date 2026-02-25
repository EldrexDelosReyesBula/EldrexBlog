import React, { useRef, useState } from 'react';
import { Category } from '../types';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: Category | 'All';
  onSelectCategory: (category: Category | 'All') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative mb-12 group max-w-full overflow-hidden">
      {/* Gradient masks for scroll indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-background to-transparent dark:from-slate-900 z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-background to-transparent dark:from-slate-900 z-10 pointer-events-none" />

      <div 
        ref={scrollContainerRef}
        className={`flex overflow-x-auto gap-3 pb-4 px-8 sm:px-12 scrollbar-hide snap-x items-center ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
        `}</style>
        
        <button
          onClick={() => !isDragging && onSelectCategory('All')}
          className={`relative flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 snap-center whitespace-nowrap ${
            selectedCategory === 'All'
              ? 'text-white shadow-lg shadow-brand-500/20'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400'
          }`}
        >
          {selectedCategory === 'All' && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-brand-600 rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">All Stories</span>
        </button>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => !isDragging && onSelectCategory(category)}
            className={`relative flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 snap-center whitespace-nowrap ${
              selectedCategory === category
                ? 'text-white shadow-lg shadow-brand-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-brand-200 dark:hover:border-brand-700 hover:text-brand-600 dark:hover:text-brand-400'
            }`}
          >
            {selectedCategory === category && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-brand-600 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default CategoryFilter;