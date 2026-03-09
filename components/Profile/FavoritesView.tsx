
import React from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { FoodItem } from '../../types';
import FoodCard from '../FoodCard';

interface FavoritesViewProps {
  wishlist: string[];
  menuItems: FoodItem[];
  onAddToCart: (item: FoodItem) => void;
  onToggleWishlist: (id: string) => void;
  onBack: () => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ 
  wishlist, 
  menuItems, 
  onAddToCart, 
  onToggleWishlist,
  onBack
}) => {
  const favoriteItems = menuItems.filter(item => wishlist.includes(item.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/5 rounded-xl border border-white/10 transition-colors text-white/60 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">My <span className="text-lime">Favorites</span></h2>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
            <Heart className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No favorites yet</h3>
          <p className="text-white/40 max-w-xs mx-auto mb-8">
            Explore our menu and tap the heart icon to save your favorite South African dishes here.
          </p>
          <button 
            onClick={onBack}
            className="bg-lime text-black font-bold px-8 py-4 rounded-full hover:bg-lime/90 transition-all active:scale-95 text-sm uppercase tracking-widest"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {favoriteItems.map(item => (
            <FoodCard 
              key={item.id} 
              item={item} 
              onAddToCart={() => onAddToCart(item)} 
              isLiked={true}
              onToggleWishlist={() => onToggleWishlist(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
