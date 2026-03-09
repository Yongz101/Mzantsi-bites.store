
import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, MapPin, ChevronDown, Bell, X } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { useLocation } from '../services/LocationContext';
import HamburgerMenu from './HamburgerMenu';
import LocationModal from './Location/LocationModal';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onOpenCart, 
  onOpenAuth, 
  searchQuery, 
  setSearchQuery, 
  setActiveTab
}) => {
  const { user } = useAuth();
  const { address: currentAddress } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-black z-[45] border-b border-white/10 h-14 sm:h-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-full flex items-center justify-between gap-4">
          {/* Mobile Location / Desktop Logo */}
          <div className="flex items-center gap-2 sm:gap-8">
            <button 
              onClick={() => setIsLocationModalOpen(true)}
              className="lg:hidden flex items-center gap-1.5 text-white/90 hover:text-white transition-colors"
            >
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium truncate max-w-[150px]">{currentAddress}</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/40" />
            </button>
            
            <span className="hidden lg:block text-xl font-bold tracking-tight text-white uppercase">
              MZANTSI<span className="text-lime">BITES</span>
            </span>
            
            <button 
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-lime text-black px-4 py-2 rounded-full font-bold text-sm transition-all hover:bg-lime/90"
            >
              <MapPin className="w-4 h-4" /> {currentAddress}
            </button>
          </div>

          <nav className="hidden lg:flex gap-8 font-medium text-white/60 text-sm">
            <a href="#menu" className="hover:text-white transition-colors">Bestsellers</a>
            <a href="#" className="hover:text-white transition-colors">Sale</a>
            <a href="#" className="hover:text-white transition-colors">New Arrivals</a>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="text-white/60 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            <button className="lg:hidden text-white/60 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <button 
              onClick={onOpenCart}
              className="hidden lg:flex items-center gap-2 text-white/60 hover:text-white transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-lime text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="hidden lg:flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Account</span>
              </button>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="hidden lg:flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Log in</span>
              </button>
            )}

            <button 
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden text-white/60 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <HamburgerMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={onOpenAuth}
      />

      <LocationModal 
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  );
};

export default Header;
