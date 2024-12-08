import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { debounce } from "lodash";

interface CategoryNavProps {
  categories: any[];
  onCategoryClick: (category: string) => void;
  onScroll: (direction: 'left' | 'right') => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

export const CategoryNav = ({ categories, onCategoryClick, onScroll, scrollRef }: CategoryNavProps) => {
  // Add error handling for ResizeObserver
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      if (error.message === 'ResizeObserver loop completed with undelivered notifications.') {
        error.stopImmediatePropagation();
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Debounce the scroll handler
  const debouncedScroll = debounce((direction: 'left' | 'right') => {
    onScroll(direction);
  }, 100);

  return (
    <div className="sticky top-16 bg-gray-50 z-40">
      <div className="relative py-4 max-w-[1400px] mx-auto px-4">
        <button 
          onClick={() => debouncedScroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div 
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide py-2 px-8 flex justify-center space-x-6 scroll-smooth"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.title)}
              className="text-gray-900 whitespace-nowrap font-medium hover:text-primary transition-colors"
            >
              {category.title}
            </button>
          ))}
        </div>

        <button 
          onClick={() => debouncedScroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};