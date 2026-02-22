
import React from 'react';
import { ChevronRight, Star } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-20 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 px-4 py-1.5 rounded-full mb-8">
            <span className="flex">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
            </span>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Top Rated South African Food</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black leading-[1.05] text-stone-900 mb-8">
            Taste the Heart of <span className="text-amber-500">Mzansi.</span>
          </h1>
          
          <p className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Experience authentic South African street food and traditional delicacies. 
            From smoky Braais to spicy Bunny Chows, we deliver the vibes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <a 
              href="#menu"
              className="px-8 py-4 bg-amber-500 text-white font-bold rounded-2xl shadow-xl shadow-amber-500/30 hover:bg-amber-600 hover:translate-y-[-2px] transition-all flex items-center gap-2 text-lg w-full sm:w-auto justify-center"
            >
              Order Online <ChevronRight className="w-5 h-5" />
            </a>
            <button className="px-8 py-4 bg-stone-100 text-stone-900 font-bold rounded-2xl hover:bg-stone-200 transition-all text-lg w-full sm:w-auto">
              View Menu
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img 
                  key={i}
                  src={`https://picsum.photos/100/100?random=${i}`} 
                  className="w-12 h-12 rounded-full border-4 border-white shadow-sm"
                  alt="Customer"
                />
              ))}
            </div>
            <p className="text-sm text-stone-500">
              <span className="font-bold text-stone-900">10k+</span> Happy Locals in the city
            </p>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative z-10 animate-[bounce_5s_infinite]">
            <img 
              src="https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=1000" 
              alt="Mzantsi Bites Hero" 
              className="rounded-[3rem] shadow-2xl w-full max-w-lg mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-700"
            />
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-100/50 rounded-full -z-10 blur-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full -z-0 opacity-20 blur-xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
