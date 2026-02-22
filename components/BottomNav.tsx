
import React from 'react';
import { Utensils, Search, MessageCircle, User, ShoppingBag } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenChat: () => void;
  cartCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onOpenChat, cartCount }) => {
  const tabs = [
    { id: 'menu', icon: Utensils, label: 'Menu' },
    { id: 'search', icon: Search, label: 'Find' },
    { id: 'chat', icon: MessageCircle, label: 'Ask Aunty', special: true },
    { id: 'account', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-stone-200 z-40 safe-bottom sm:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          if (tab.id === 'chat') {
            return (
              <button 
                key={tab.id}
                onClick={onOpenChat}
                className="relative -top-5 bg-amber-500 p-4 rounded-full shadow-xl shadow-amber-500/40 text-white active:scale-90 transition-transform"
              >
                <Icon className="w-7 h-7" />
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full gap-1 transition-colors ${
                isActive ? 'text-amber-500' : 'text-stone-400'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-amber-500/10' : ''}`} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
