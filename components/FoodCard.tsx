
import React from 'react';
import { Plus, Heart, Bike } from 'lucide-react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: () => void;
  isLiked: boolean;
  onToggleWishlist: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onAddToCart, isLiked, onToggleWishlist }) => {
  return (
    <div className="group bg-black rounded-xl sm:rounded-2xl overflow-hidden transition-all flex flex-col h-full relative border border-white/5 sm:border-none">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-lg sm:rounded-xl m-1 sm:m-1.5">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Discount Badge */}
        {item.originalPrice && (
          <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 z-10 bg-red-600 text-white text-[8px] sm:text-[10px] font-black px-2 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-widest shadow-lg">
            -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          className={`absolute top-1.5 right-1.5 sm:top-3 sm:right-3 z-10 backdrop-blur-md p-1.5 sm:p-2 rounded-full transition-all border border-white/10 ${
            isLiked 
              ? 'bg-red-500 text-white border-red-500' 
              : 'bg-black/60 text-white hover:bg-white hover:text-black'
          }`}
        >
          <Heart className={`w-3 h-3 sm:w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Add to Cart Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="absolute bottom-1.5 right-1.5 sm:bottom-3 sm:right-3 z-10 bg-lime text-black w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-xl shadow-lime/20 hover:scale-105"
        >
          <Plus className="w-3.5 h-3.5 sm:w-5 sm:h-5" strokeWidth={3} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-6 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-2xl font-bold text-white mb-0.5 sm:mb-2 leading-tight line-clamp-1">
          {item.name}
        </h3>
        
        <p className="text-[10px] sm:text-sm text-white/40 mb-3 sm:mb-6 line-clamp-1">
          {item.description || 'best food in the world'}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1.5 sm:gap-3">
            <span className="text-lg sm:text-3xl font-bold text-lime">R{item.price.toFixed(0)}</span>
            {item.originalPrice && (
              <span className="text-[10px] sm:text-lg text-white/30 line-through font-medium">R{item.originalPrice.toFixed(0)}</span>
            )}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center gap-1.5 sm:gap-3 mt-3 sm:mt-6 text-white/60">
          <Bike className="w-3.5 h-3.5 sm:w-5 h-5" />
          <span className="text-[10px] sm:text-sm font-medium">Delivery R152.12</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
