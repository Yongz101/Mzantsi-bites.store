
import React from 'react';

const CATEGORY_ITEMS = [
  { name: 'Beef stew', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400' },
  { name: 'Breakfast', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400' },
  { name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400' },
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400' },
  { name: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400' },
];

interface CategorySectionProps {
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
}

const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory, selectedCategory }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Categories</h2>
        <button className="text-lime text-xs sm:text-sm font-bold hover:underline transition-all">See all</button>
      </div>
      
      <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2 sm:mx-0 sm:px-0">
        {CATEGORY_ITEMS.map((cat) => (
          <button
            key={cat.name}
            onClick={() => onSelectCategory(cat.name === 'Beef stew' ? 'Braai' : cat.name)} // Mapping for demo
            className="flex flex-col items-center gap-2 sm:gap-3 group flex-shrink-0"
          >
            <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all ${
              selectedCategory === cat.name ? 'border-lime scale-105 sm:scale-110 shadow-lg shadow-lime/20' : 'border-white/5 group-hover:border-white/20'
            }`}>
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className={`text-xs font-bold transition-colors ${
              selectedCategory === cat.name ? 'text-white' : 'text-white/40 group-hover:text-white'
            }`}>
              {cat.name}
            </span>
            {selectedCategory === cat.name && (
              <div className="w-8 h-1 bg-lime rounded-full mt-1" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
