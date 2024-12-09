import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComplementaryItem } from "./ComplementaryItem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ComplementaryItems = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: complementaryItems = [] } = useQuery({
    queryKey: ['complementary-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_complementary', true)
        .eq('active', true);
      
      if (error) throw error;
      return data;
    },
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (complementaryItems.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-[#2D3648]">
        Compliment your Order
      </h3>
      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-1 hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 pb-2 -mx-6 px-6 scrollbar-hide relative scroll-smooth snap-x"
        >
          {complementaryItems.map((item) => (
            <ComplementaryItem
              key={item.id}
              name={item.title}
              price={item.price || 24.00}
              image={item.image_url || '/placeholder.svg'}
            />
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-1 hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};