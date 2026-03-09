
import React from 'react';
import { Star, Heart, ShoppingBag, UserPlus } from 'lucide-react';
import { useAuth } from '../services/AuthContext';

interface HeroProps {
  onOpenAuth: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAuth }) => {
  const { user } = useAuth();

  return (
    <section className="bg-black py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        
        {/* Left Side: Image Gallery Style */}
        <div className="w-full lg:w-1/2 flex flex-col gap-8">
          <div className="relative group">
            <div className="absolute top-6 left-6 z-10 bg-lime text-black text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
              Bestseller
            </div>
            {!user && (
              <button 
                onClick={onOpenAuth}
                className="absolute bottom-6 left-6 z-10 bg-white text-black text-[10px] font-bold px-6 py-3 rounded-full uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:bg-lime transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Join Now
              </button>
            )}
            <button className="absolute top-6 right-6 z-10 bg-black/40 backdrop-blur-md p-3.5 rounded-full text-white hover:bg-lime hover:text-black transition-all border border-white/5">
              <Heart className="w-5 h-5" />
            </button>
            <img 
              src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1200" 
              alt="Featured Product" 
              className="w-full aspect-square object-cover rounded-[48px] border border-white/5 transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`flex-shrink-0 w-24 h-24 rounded-[24px] border-2 ${i === 1 ? 'border-lime' : 'border-white/5'} overflow-hidden cursor-pointer hover:border-lime/50 transition-all active:scale-90`}>
                <img src={`https://picsum.photos/200/200?random=${i}`} className="w-full h-full object-cover" alt="Thumbnail" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Product Info */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Mzantsi Bites</span>
              {user && (
                <span className="text-[10px] font-bold text-lime uppercase tracking-widest">Welcome back, {user.name.split(' ')[0]}!</span>
              )}
            </div>
            <h1 className="text-3xl sm:text-6xl font-bold text-white leading-[0.9] uppercase tracking-tighter">
              QUARTER MUTTON <br /> <span className="text-lime">BUNNY CHOW</span>
            </h1>
            <div className="flex items-center gap-6 pt-1">
              <div className="flex items-center gap-2 text-lime">
                <Star className="w-4 h-4 fill-lime" />
                <span className="text-sm font-bold">4.2</span>
              </div>
              <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest underline underline-offset-8 cursor-pointer hover:text-white transition-colors">12,384 reviews</span>
            </div>
          </div>

          <p className="text-white/40 leading-relaxed font-medium text-sm sm:text-base max-w-xl">
            A Durban classic. Hollowed out loaf of bread filled with spicy mutton curry, served with carrot sambals. Experience the authentic taste of the coast.
          </p>

          <div className="text-4xl font-bold text-white tracking-tighter">R 125.00</div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Key Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white/60 text-xs font-bold uppercase tracking-widest">
              <li className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="w-1.5 h-1.5 bg-lime rounded-full" />
                Authentic Spices
              </li>
              <li className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-1.5 h-1.5 bg-lime rounded-full" />
                Local Bread
              </li>
              <li className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-1.5 h-1.5 bg-lime rounded-full" />
                Carrot Sambals
              </li>
              <li className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-1.5 h-1.5 bg-lime rounded-full" />
                Slow Cooked
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button className="flex-grow bg-lime text-black font-bold py-5 rounded-full hover:bg-lime/90 transition-all active:scale-95 text-sm uppercase tracking-widest">
              Buy Now
            </button>
            <button className="w-16 h-16 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center shadow-xl shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
