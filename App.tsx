
import React, { useState, useMemo, useEffect } from 'react';
// Added missing Utensils import
import { MapPin, Bell, Utensils } from 'lucide-react';
import { FoodItem, CartItem } from './types';
import { MENU_ITEMS, CATEGORIES } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import FoodCard from './components/FoodCard';
import CartSidebar from './components/CartSidebar';
import ChatBot from './components/ChatBot';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [locationName, setLocationName] = useState('Detecting Location...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationName('Johannesburg South'), // Mocking localized result
        () => setLocationName('Sandton Kitchen')
      );
    }
  }, []);

  const filteredMenu = useMemo(() => {
    if (selectedCategory === 'All') return MENU_ITEMS;
    return MENU_ITEMS.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    // Visual feedback for mobile instead of opening cart immediately
    if (window.innerWidth < 640) {
      // Small haptic-like bounce could go here
    } else {
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (showSplash) return <SplashScreen onComplete={() => setShowSplash(false)} />;

  return (
    <div className="min-h-screen relative flex flex-col bg-stone-50 overflow-x-hidden">
      <Header cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      
      <main className="flex-grow pt-20 pb-24 sm:pb-0">
        {/* Mobile App Bar */}
        <div className="px-4 py-4 flex justify-between items-center bg-white sm:hidden sticky top-20 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-amber-100 p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Delivering to</p>
              <p className="text-sm font-black text-stone-900 leading-tight">{locationName}</p>
            </div>
          </div>
          <button className="relative p-2 bg-stone-100 rounded-full">
            <Bell className="w-5 h-5 text-stone-600" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        <Hero />
        
        {/* Horizontal Category Scroll for App-feel */}
        <div className="sticky top-20 sm:top-24 z-20 bg-stone-50/80 backdrop-blur-md py-4 border-b border-stone-200 overflow-x-auto whitespace-nowrap px-4 flex gap-3 no-scrollbar sm:hidden">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30' 
                : 'bg-white text-stone-600 border border-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Desktop Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="menu">
          <div className="hidden sm:flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-4xl font-black text-stone-900 mb-2">Explore Our Menu</h2>
              <p className="text-stone-500 max-w-lg">From the heart of Soweto to the shores of Cape Town.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === cat ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-stone-600 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredMenu.map(item => (
              <FoodCard key={item.id} item={item} onAddToCart={() => addToCart(item)} />
            ))}
          </div>
        </section>

        {/* Heritage App Section */}
        <section className="bg-stone-900 text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800" 
              className="rounded-[2.5rem] shadow-2xl w-full"
              alt="Braai"
            />
            <div>
              <h2 className="text-4xl font-black mb-6 leading-tight">Authentic. Lekker. Home.</h2>
              <p className="text-stone-400 text-lg leading-relaxed mb-8">
                Every dish is a tribute to the diverse cultures that make South Africa special.
              </p>
              <button className="bg-amber-500 text-stone-950 font-black px-8 py-4 rounded-2xl hover:scale-105 transition-transform">
                Read Our Story
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-stone-50 border-t border-stone-200 py-12 pb-32 sm:pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black">MZANTSI<span className="text-amber-500">BITES</span></span>
          </div>
          <p className="text-stone-500 text-sm">© 2025 Mzantsi Bites App. Built for the Nation.</p>
        </div>
      </footer>

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenChat={() => setIsChatOpen(true)}
        cartCount={cartCount}
      />

      {/* Desktop Chat Toggle */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="hidden sm:flex fixed bottom-6 right-6 bg-amber-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform items-center justify-center z-40"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-900 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-stone-900"></span>
        </span>
        <Utensils className="w-6 h-6" />
      </button>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity}
      />

      <ChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

export default App;
