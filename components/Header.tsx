
import React from 'react';
import { ShoppingBag, UtensilsCrossed, Search, User, Menu } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-[45] border-b border-stone-100 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <UtensilsCrossed className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter">
            MZANTSI<span className="text-amber-500">BITES</span>
          </span>
        </div>

        <nav className="hidden md:flex gap-10 font-bold text-stone-500 uppercase tracking-widest text-[10px]">
          <a href="#menu" className="hover:text-amber-500 transition-colors">Order Now</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Our Story</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Catering</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Partners</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex p-2.5 hover:bg-stone-100 rounded-xl transition-colors">
            <Search className="w-5 h-5 text-stone-600" />
          </button>
          <button 
            onClick={onOpenCart}
            className="flex items-center gap-2.5 bg-stone-900 text-white px-5 py-3 rounded-2xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10 active:scale-95 group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-stone-900 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="font-bold text-xs uppercase tracking-widest hidden sm:block">My Bag</span>
          </button>
          <button className="sm:hidden p-2.5 text-stone-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
