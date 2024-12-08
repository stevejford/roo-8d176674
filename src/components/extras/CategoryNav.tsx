import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryNavProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
  onScroll: (direction: 'left' | 'right') => void;
}

export const CategoryNav = React.forwardRef<HTMLDivElement, CategoryNavProps>(
  ({ categories, onCategoryClick, onScroll }, ref) => {
    return (
      <div className="relative mb-4">
        <button 
          onClick={() => onScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-lg rounded-full hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div 
          ref={ref}
          className="overflow-x-auto scrollbar-hide py-2 px-8 flex space-x-6 scroll-smooth"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryClick(category)}
              className="text-[#2D3648] whitespace-nowrap text-sm font-medium hover:text-primary transition-colors"
            >
              {category}
            </button>
          ))}
        </div>

        <button 
          onClick={() => onScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-lg rounded-full hover:bg-gray-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }
);

CategoryNav.displayName = 'CategoryNav';