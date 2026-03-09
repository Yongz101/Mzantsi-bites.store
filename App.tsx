
import React, { useState, useMemo, useEffect } from 'react';
import { Utensils } from 'lucide-react';
import { FoodItem, CartItem } from './types';
import { collection, getDocs, addDoc, query, limit } from 'firebase/firestore';
import { db } from './firebase';
import { MENU_ITEMS, CATEGORIES } from './constants';
import Header from './components/Header';
import Hero from './components/Hero';
import FoodCard from './components/FoodCard';
import CartSidebar from './components/CartSidebar';
import ChatBot from './components/ChatBot';
import BottomNav from './components/BottomNav';
import SplashScreen from './components/SplashScreen';
import AuthModal from './components/Auth/AuthModal';
import CategorySection from './components/CategorySection';
import { AuthProvider, useAuth } from './services/AuthContext';
import StoreDashboard from './components/Store/StoreDashboard';
import DriverDashboard from './components/Driver/DriverDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import { ThemeProvider, useTheme } from './services/ThemeContext';
import { LocationProvider, useLocation } from './services/LocationContext';
import ProfileView from './components/Profile/ProfileView';
import WalletView from './components/Profile/WalletView';
import SettingsView from './components/Profile/SettingsView';
import FavoritesView from './components/Profile/FavoritesView';
import MapView from './components/Location/MapView';
import PaymentSuccess from './components/Payment/PaymentSuccess';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('menu');
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (querySnapshot.empty) {
          // Only attempt to seed if we have a user and they are an admin/store
          // Otherwise just use fallback
          if (user && (user.role === 'admin' || user.role === 'store')) {
            console.log('Seeding database...');
            for (const item of MENU_ITEMS) {
              await addDoc(collection(db, 'products'), item);
            }
          }
          setMenuItems(MENU_ITEMS);
        } else {
          const items = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as FoodItem[];
          setMenuItems(items);
        }
      } catch (err: any) {
        // If it's a permission error, it's expected for non-logged in users if rules are strict
        if (err.code === 'permission-denied') {
          // Silent fallback to local menu
        } else {
          console.error('Error fetching menu:', err);
        }
        setMenuItems(MENU_ITEMS); // Fallback
      }
    };
    fetchMenu();
  }, [user]); // Re-fetch when user changes to handle permission changes

  useEffect(() => {
    if (window.location.pathname === '/payment-success') {
      setActiveTab('payment-success');
    }
    
    // Handle external checkout sessions via URL
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session');
    
    if (sessionId) {
      const fetchSession = async () => {
        try {
          const response = await fetch(`/api/checkout-session/${sessionId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.items) {
              setCart(data.items);
              setIsCartOpen(true);
              // Clean up URL
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          }
        } catch (error) {
          console.error("Failed to fetch checkout session:", error);
        }
      };
      fetchSession();
    }
  }, []);

  const filteredMenu = useMemo(() => {
    let items = menuItems;
    if (selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    return items;
  }, [selectedCategory, searchQuery, menuItems]);

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

  const toggleWishlist = (id: string) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (loading) return <SplashScreen onComplete={() => {}} />;

  const renderContent = () => {
    if (activeTab === 'payment-success') {
      return (
        <PaymentSuccess 
          onGoHome={() => {
            setActiveTab('menu');
            setCart([]);
            window.history.replaceState({}, document.title, '/');
          }}
          onViewOrders={() => {
            setActiveTab('profile');
            setCart([]);
            window.history.replaceState({}, document.title, '/');
          }}
        />
      );
    }

    if (user && user.role === 'customer') {
      if (activeTab === 'profile') return <ProfileView />;
      if (activeTab === 'wallet') return <WalletView />;
      if (activeTab === 'settings') return <SettingsView />;
      if (activeTab === 'wishlist') return (
        <FavoritesView 
          wishlist={wishlist} 
          menuItems={menuItems} 
          onAddToCart={addToCart} 
          onToggleWishlist={toggleWishlist}
          onBack={() => setActiveTab('menu')}
        />
      );
      if (activeTab === 'location') return <MapView />;
      if (activeTab === 'offers') {
        const discountedItems = menuItems.filter(item => item.originalPrice);
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center gap-4 mb-12">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Hot Deals</h2>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Exclusive discounts for you</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {discountedItems.map(item => (
                <FoodCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={() => addToCart(item)} 
                  isLiked={wishlist.includes(item.id)}
                  onToggleWishlist={() => toggleWishlist(item.id)}
                />
              ))}
            </div>
          </div>
        );
      }
    }

    if (!user || user.role === 'customer') {
      if (activeTab === 'wishlist') return (
        <FavoritesView 
          wishlist={wishlist} 
          menuItems={menuItems} 
          onAddToCart={addToCart} 
          onToggleWishlist={toggleWishlist}
          onBack={() => setActiveTab('menu')}
        />
      );
      if (activeTab === 'location') return <MapView />;
      if (activeTab === 'offers') {
        const discountedItems = menuItems.filter(item => item.originalPrice);
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col items-center gap-4 mb-12">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Hot Deals</h2>
              <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Exclusive discounts for you</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {discountedItems.map(item => (
                <FoodCard 
                  key={item.id} 
                  item={item} 
                  onAddToCart={() => addToCart(item)} 
                  isLiked={wishlist.includes(item.id)}
                  onToggleWishlist={() => toggleWishlist(item.id)}
                />
              ))}
            </div>
          </div>
        );
      }
      return (
        <>
          <Hero onOpenAuth={() => setIsAuthOpen(true)} />
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col lg:flex-row gap-4 sm:gap-8">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tighter">Bestsellers</h2>
                <div className="space-y-3">
                  <div 
                    onClick={() => setSelectedCategory('All')}
                    className={`flex items-center justify-between group cursor-pointer ${selectedCategory === 'All' ? 'text-lime' : 'text-white/40 hover:text-white'}`}
                  >
                    <span className="text-sm font-bold transition-colors">All items</span>
                    {selectedCategory === 'All' && <div className="w-1 h-1 bg-lime rounded-full" />}
                  </div>
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <div 
                      key={cat} 
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center justify-between group cursor-pointer ${selectedCategory === cat ? 'text-lime' : 'text-white/40 hover:text-white'}`}
                    >
                      <span className="text-sm font-bold transition-colors">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Price</h3>
                  <button className="text-white/40 hover:text-white transition-colors">
                    <Utensils className="w-4 h-4 rotate-180" />
                  </button>
                </div>
                <div className="h-1 bg-white/5 rounded-full relative">
                  <div className="absolute inset-y-0 left-0 right-1/4 bg-lime rounded-full" />
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl" />
                  <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-xl" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Spiciness</h3>
                  <button className="text-white/40 hover:text-white transition-colors">
                    <Utensils className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {['Mild', 'Medium', 'Hot'].map(level => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-5 h-5 rounded-full border border-white/10 group-hover:border-lime transition-colors flex items-center justify-center">
                        <div className="w-2 h-2 bg-lime rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
                      </div>
                      <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors uppercase tracking-widest">{level}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-grow">
              <div className="mb-8">
                <span className="text-sm font-medium text-white/60">Black 's Store</span>
              </div>
              
              <CategorySection 
                onSelectCategory={setSelectedCategory} 
                selectedCategory={selectedCategory} 
              />

              <div className="flex flex-col items-center gap-6 mb-8">
                <h2 className="text-3xl font-bold text-white">Menu Items</h2>
                <div className="flex items-center justify-center w-full">
                  <div className="bg-white/5 p-0.5 rounded-full flex gap-1 border border-white/10">
                    <button className="px-5 py-1.5 rounded-full text-[10px] font-bold bg-lime text-black transition-all">
                      Discover
                    </button>
                    <button className="px-5 py-1.5 rounded-full text-[10px] font-bold text-white/40 hover:text-white transition-all">
                      Following
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Categories (Keep for fallback or remove if CategorySection is enough) */}
              <div className="lg:hidden flex gap-3 overflow-x-auto pb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 mb-4">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                      selectedCategory === cat 
                      ? 'bg-lime text-black border-lime' 
                      : 'bg-white/5 text-white/40 border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
                {filteredMenu.map(item => (
                  <FoodCard 
                    key={item.id} 
                    item={item} 
                    onAddToCart={() => addToCart(item)} 
                    isLiked={wishlist.includes(item.id)}
                    onToggleWishlist={() => toggleWishlist(item.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      );
    }

    if (user.role === 'store') return <StoreDashboard />;
    if (user.role === 'driver') return <DriverDashboard />;
    if (user.role === 'admin') return <AdminDashboard />;

    return null;
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-x-hidden bg-black text-white">
      <Header 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveTab={setActiveTab}
      />
      
      <main className={`flex-grow ${activeTab === 'location' ? 'h-[calc(100vh-112px)] sm:h-[calc(100vh-64px)] pt-14 sm:pt-16 pb-14 sm:pb-0 px-0' : 'pt-14 sm:pt-20 pb-8 sm:pb-2 px-3 sm:px-6'}`}>
        {renderContent()}
      </main>

      {activeTab !== 'location' && (
        <footer className="bg-black text-white border-t border-white/5 py-2 pb-14 sm:pb-2 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tighter uppercase">MZANTSI<span className="text-lime">BITES</span></span>
            </div>
            <p className="text-white/20 text-[8px] font-bold uppercase tracking-[0.3em]">© 2025 Mzantsi Bites App. Built for the Nation.</p>
          </div>
        </footer>
      )}

      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        cartCount={cartCount}
        user={user}
      />

      {/* Desktop Chat Toggle */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="hidden sm:flex fixed bottom-8 right-8 bg-lime text-black p-5 rounded-[24px] shadow-2xl shadow-lime/20 hover:scale-110 transition-all items-center justify-center z-40 active:scale-90"
      >
        <Utensils className="w-6 h-6" />
      </button>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQuantity={updateQuantity}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <AppContent />
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
