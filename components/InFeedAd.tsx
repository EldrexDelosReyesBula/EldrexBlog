import React, { useEffect, useRef } from 'react';

const InFeedAd: React.FC = () => {
  const adRef = useRef<HTMLModElement>(null);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
  
    if (!adRef.current) return;
    if (adRef.current.getAttribute('data-ad-status')) {
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
    <div className="bg-slate-50/40 dark:bg-slate-800/20 rounded-2xl overflow-hidden flex flex-col h-full min-h-[250px] transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 group">
       <div className="flex justify-end px-4 py-2 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sponsored</span>
       </div>
       <div className="flex-1 w-full flex items-center justify-center p-2 relative">
          <ins className="adsbygoogle"
             ref={adRef}
             style={{ display: 'block', width: '100%', textAlign: 'center' }}
             data-ad-format="fluid"
             data-ad-layout-key="+41+q1+1y-c7+bv"
             data-ad-client="ca-pub-6548730882346475"
             data-ad-slot="3864003907"></ins>
       </div>
    </div>
  );
};

export default InFeedAd;
