
import React, { useState } from 'react';
import { X, Settings, User, Wallet, LogOut, Sun, Moon, Phone, UtensilsCrossed, Search, Heart, MapPin } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { useTheme } from '../services/ThemeContext';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenAuth: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ 
  isOpen, 
  onClose, 
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenAuth
}) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [radius, setRadius] = useState(79);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="relative w-full md:w-[320px] bg-black text-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-white/10 md:rounded-l-2xl">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-white/5">
          <div className="w-8" /> {/* Spacer */}
          <h2 className="text-2xl font-serif font-bold uppercase tracking-tighter">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-4 pt-2 pb-6 space-y-2 w-full">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH FOR FOOD..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-[9px] font-bold uppercase tracking-widest outline-none focus:border-lime transition-all text-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white/40" />
              </button>
            )}
          </div>

          {/* Search Radius */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Search Radius</span>
              <span className="text-xs font-bold text-lime">{radius} km</span>
            </div>
            <div className="relative flex items-center">
              <input 
                type="range" 
                min="1" 
                max="100" 
                value={radius} 
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-lime"
              />
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/10">
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Theme</span>
            <div className="flex items-center gap-2 bg-black p-1 rounded-full border border-white/10">
              <button 
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-lime text-black' : 'text-white/20'}`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-lime text-black' : 'text-white/20'}`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            <button 
              onClick={() => { setActiveTab('menu'); onClose(); }}
              className="w-full flex items-center gap-4 p-4 border border-white/5 hover:border-lime/20 hover:bg-lime/5 transition-all group rounded-xl"
            >
              <UtensilsCrossed className="w-5 h-5 text-white/40 group-hover:text-lime" />
              <span className="font-bold uppercase tracking-widest text-[10px]">Home / Menu</span>
            </button>
            <button 
              onClick={() => { setActiveTab('wishlist'); onClose(); }}
              className="w-full flex items-center gap-4 p-4 border border-white/5 hover:border-lime/20 hover:bg-lime/5 transition-all group rounded-xl"
            >
              <Heart className="w-5 h-5 text-white/40 group-hover:text-lime" />
              <span className="font-bold uppercase tracking-widest text-[10px]">My Wishlist</span>
            </button>
            <button 
              onClick={() => { setActiveTab('location'); onClose(); }}
              className="w-full flex items-center gap-4 p-4 border border-white/5 hover:border-lime/20 hover:bg-lime/5 transition-all group rounded-xl"
            >
              <MapPin className="w-5 h-5 text-white/40 group-hover:text-lime" />
              <span className="font-bold uppercase tracking-widest text-[10px]">Find Stores</span>
            </button>
            <button 
              onClick={() => { setActiveTab('settings'); onClose(); }}
              className="w-full flex items-center gap-4 p-4 border border-white/5 hover:border-lime/20 hover:bg-lime/5 transition-all group rounded-xl"
            >
              <Settings className="w-5 h-5 text-white/40 group-hover:text-lime" />
              <span className="font-bold uppercase tracking-widest text-[10px]">Settings</span>
            </button>
            <button 
              onClick={() => { 
                if (user) {
                  setActiveTab('profile'); 
                } else {
                  onOpenAuth();
                }
                onClose(); 
              }}
              className="w-full flex items-center gap-4 p-4 border border-white/5 hover:border-lime/20 hover:bg-lime/5 transition-all group rounded-xl"
            >
              <User className="w-5 h-5 text-white/40 group-hover:text-lime" />
              <span className="font-bold uppercase tracking-widest text-[10px]">
                {user ? 'Profile' : 'Login / Register'}
              </span>
            </button>
            <button 
              onClick={() => { setActiveTab('wallet'); onClose(); }}
              className="w-full flex items-center gap-4 p-4 border border-white/5 hover:border-lime/20 hover:bg-lime/5 transition-all group rounded-xl"
            >
              <Wallet className="w-5 h-5 text-white/40 group-hover:text-lime" />
              <span className="font-bold uppercase tracking-widest text-[10px]">Wallet</span>
            </button>
            {user && (
              <button 
                onClick={() => { logout(); onClose(); }}
                className="w-full flex items-center gap-4 p-4 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all group rounded-xl"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-bold uppercase tracking-widest text-[10px]">Log Out</span>
              </button>
            )}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 p-3 rounded-2xl flex justify-between items-center border border-white/10">
            <span className="font-bold uppercase tracking-widest text-[9px] text-white/40">Contact Us</span>
            <button className="bg-lime text-black p-3 rounded-lg hover:bg-lime/90 transition-all active:scale-95">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
