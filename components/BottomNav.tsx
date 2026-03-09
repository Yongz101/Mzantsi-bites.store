
import React from 'react';
import { Home, Percent, Heart, ShoppingCart, MapPin } from 'lucide-react';
import { User as UserType } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenChat: () => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  cartCount: number;
  user: UserType | null;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onOpenChat, onOpenCart, onOpenAuth, cartCount, user }) => {
  const tabs = [
    { id: 'menu', icon: Home, label: 'Home' },
    { id: 'offers', icon: Percent, label: 'Offers' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart' },
    { id: 'location', icon: MapPin, label: 'Location' }
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'cart') {
      onOpenCart();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/5 z-40 safe-bottom sm:hidden transition-all duration-500">
      <div className="flex justify-around items-center h-14 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center w-full transition-all relative active:scale-90 ${
                isActive ? 'text-lime scale-110' : 'text-white/40'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {tab.id === 'cart' && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
