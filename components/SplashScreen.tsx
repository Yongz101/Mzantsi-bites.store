
import React, { useEffect, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] bg-amber-500 flex flex-col items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative">
        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl animate-bounce">
          <UtensilsCrossed className="w-12 h-12 text-amber-500" />
        </div>
        <div className="absolute -inset-4 bg-white/20 rounded-full animate-ping -z-10"></div>
      </div>
      <h1 className="mt-8 text-white text-4xl font-black tracking-tighter">
        MZANTSI<span className="text-stone-900">BITES</span>
      </h1>
      <p className="mt-2 text-white/80 font-bold uppercase tracking-widest text-xs">Authentic South African</p>
      
      <div className="absolute bottom-12 flex flex-col items-center">
        <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white w-full animate-[progress_2s_ease-in-out]"></div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
