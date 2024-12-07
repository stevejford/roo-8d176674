import React, { useRef } from "react";
import { Search, ChevronLeft, ChevronRight, HopOff } from "lucide-react";
import { Input } from "./ui/input";

const categories = [
  "Popular",
  "Specials",
  "Entrée",
  "Traditional Pizza",
  "Gourmet Pizza",
  "Pasta & Risotto",
  "Garlic Bread",
  "Mains",
  "Desserts",
  "Shakes",
  "Soft Drinks",
];

export const Navbar = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-3">
          <div className="flex-shrink-0 flex items-center gap-2">
            <HopOff className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Roo Restaurant</h1>
          </div>
          <div className="flex-1 max-w-[280px]">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search Menu"
                className="w-full pr-12 h-9 text-sm rounded-full border-gray-200 placeholder:text-gray-500"
              />
              <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2">
                <button className="p-1.5 bg-primary rounded-full hover:bg-primary/90 transition-colors">
                  <Search className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex items-center">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide py-4 px-8 flex space-x-8 w-full scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category) => (
              <button
                key={category}
                className="text-gray-900 font-semibold text-[15px] leading-[18.75px] tracking-[-0.375px] capitalize whitespace-nowrap font-inter antialiased hover:text-primary transition-colors cursor-pointer"
              >
                {category}
              </button>
            ))}
          </div>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 z-10 p-2 bg-white shadow-lg rounded-full hover:bg-gray-50"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};