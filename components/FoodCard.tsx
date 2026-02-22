
import React from 'react';
import { Plus, Flame, Star } from 'lucide-react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  onAddToCart: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-3xl border border-stone-100 overflow-hidden hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-500">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {item.popular && (
            <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg">
              <Star className="w-2.5 h-2.5 fill-white" /> Popular
            </span>
          )}
          {item.spiciness && (
            <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg ${
              item.spiciness === 'Hot' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
            }`}>
              <Flame className="w-2.5 h-2.5" /> {item.spiciness}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-black text-stone-900 leading-tight">{item.name}</h3>
          <span className="text-lg font-black text-amber-600 whitespace-nowrap">R {item.price}</span>
        </div>
        <p className="text-stone-500 text-sm mb-6 line-clamp-2 leading-relaxed">{item.description}</p>
        
        <button 
          onClick={onAddToCart}
          className="w-full bg-stone-950 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-amber-500 transition-colors active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add to Order
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
