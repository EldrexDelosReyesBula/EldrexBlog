import React, { useEffect, useRef } from 'react';

const InFeedAd: React.FC = () => {
  const adRef = useRef<boolean>(false);

  useEffect(() => {
    // Ensure we only request an ad once per component mount
    if (adRef.current) return;

    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      adRef.current = true;
    } catch (e) {
      console.error("AdSense Error:", e);
    }
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col p-4 h-full min-h-[280px]">
       <div className="w-full text-left text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mb-2">Sponsored</div>
       <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl overflow-hidden">
          <ins className="adsbygoogle"
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
