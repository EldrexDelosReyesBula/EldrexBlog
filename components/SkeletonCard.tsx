import React, { forwardRef } from 'react';

const SkeletonCard = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative h-64 animate-shimmer" />
      
      <div className="p-5 flex flex-col flex-grow gap-4">
        {/* Date/Category */}
        <div className="h-4 w-24 rounded animate-shimmer" />
        
        {/* Title */}
        <div className="space-y-2">
            <div className="h-7 w-full rounded animate-shimmer" />
            <div className="h-7 w-3/4 rounded animate-shimmer" />
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2 mt-2">
            <div className="h-4 w-full rounded animate-shimmer" />
            <div className="h-4 w-full rounded animate-shimmer" />
            <div className="h-4 w-2/3 rounded animate-shimmer" />
        </div>
        
        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
           <div className="h-4 w-20 rounded animate-shimmer" />
           <div className="h-4 w-4 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

export default SkeletonCard;