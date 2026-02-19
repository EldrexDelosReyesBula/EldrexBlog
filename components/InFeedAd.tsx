import React, { useEffect, useRef } from 'react';

const InFeedAd: React.FC = () => {
  const adRef = useRef<HTMLModElement>(null);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    if (!adRef.current) return;
    if (adRef.current.innerHTML.trim() !== "") {
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
  }, []);

  return (
    <div className="flex flex-col h-full w-full min-h-[320px] sm:min-h-[380px]">
       <div className="relative w-full h-full overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-500 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 group flex flex-col">
          
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-500 dark:text-slate-400 shadow-sm tracking-wide uppercase">
              Sponsored
            </span>
          </div>

          <div className="flex-1 w-full h-full flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
              <ins className="adsbygoogle"
                 ref={adRef}
                 style={{ display: 'block', width: '100%', height: '100%' }}
                 data-ad-format="fluid"
                 data-ad-layout-key="+41+q1+1y-c7+bv"
                 data-ad-client="ca-pub-6548730882346475"
                 data-ad-slot="3864003907"></ins>
          </div>
       </div>
    </div>
  );
};

export default InFeedAd;
