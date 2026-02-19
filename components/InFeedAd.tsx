import React, { useEffect, useRef, useState } from 'react';

interface InFeedAdProps {
  className?: string;
  showBadge?: boolean;
}

const InFeedAd: React.FC<InFeedAdProps> = ({ className, showBadge = true }) => {
  const adRef = useRef<HTMLModElement>(null);
  const didInit = useRef(false);
  const [adConfig, setAdConfig] = useState<{ slot: string; layoutKey: string } | null>(null);

  useEffect(() => {
    // Detect device type based on width (md breakpoint is typically 768px)
    const updateConfig = () => {
        const isDesktop = window.innerWidth >= 768;
        
        // Only update if not set yet to prevent re-renders/ad-reloads during resize
        setAdConfig((prev) => {
            if (prev) return prev; // Keep initial config to avoid flickering
            return isDesktop ? {
                slot: "3480860525", // Desktop Slot
                layoutKey: "-5k+ct+1x-c7+bz"
            } : {
                slot: "3864003907", // Mobile Slot
                layoutKey: "+41+q1+1y-c7+bv"
            };
        });
    };

    updateConfig();
  }, []);

  useEffect(() => {
    if (!adConfig || !adRef.current) return;
    
    const pushAd = () => {
        if (!adRef.current || didInit.current) return;

        // Double check if the ad slot is already filled
        if (adRef.current.innerHTML.trim() !== "" || adRef.current.getAttribute('data-ad-status')) {
             didInit.current = true;
             return;
        }

        try {
          didInit.current = true;
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          if (e instanceof Error && !e.message.includes('already have ads')) {
             console.error("AdSense Error:", e);
          }
        }
    };

    const observer = new ResizeObserver((entries) => {
        if (didInit.current) {
            observer.disconnect();
            return;
        }

        for (const entry of entries) {
            // AdSense Fluid ads generally need some width to render
            if (entry.contentRect.width >= 200) {
                pushAd();
                observer.disconnect();
                break;
            }
        }
    });

    observer.observe(adRef.current);

    if (adRef.current.offsetWidth >= 200) {
        pushAd();
        observer.disconnect();
    }

    return () => observer.disconnect();
  }, [adConfig]);

  if (!adConfig) {
      return (
        <div className={`flex flex-col w-full bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-700 ${className || 'min-h-[320px] sm:min-h-[380px]'}`} />
      );
  }

  return (
    <div className={`flex flex-col w-full ${className || 'min-h-[320px] sm:min-h-[380px]'}`}>
       <div className="relative w-full h-full overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 group flex flex-col">
          
          {showBadge && (
            <div className="absolute top-4 left-4 z-20">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100/90 dark:bg-slate-700/90 backdrop-blur-sm text-slate-500 dark:text-slate-300 shadow-sm tracking-wider uppercase border border-slate-200 dark:border-slate-600">
                Ad
              </span>
            </div>
          )}

          <div className="flex-1 w-full h-full flex items-center justify-center bg-slate-50/30 dark:bg-slate-900/30 p-2">
              <ins className="adsbygoogle"
                 ref={adRef}
                 style={{ display: 'block', width: '100%', height: '100%' }}
                 data-ad-format="fluid"
                 data-ad-layout-key={adConfig.layoutKey}
                 data-ad-client="ca-pub-6548730882346475"
                 data-ad-slot={adConfig.slot}></ins>
          </div>
       </div>
    </div>
  );
};

export default InFeedAd;
