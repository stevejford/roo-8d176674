import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { OrderSidebar } from "@/components/OrderSidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { AdminButton } from "@/components/index/AdminButton";
import { CategorySection } from "@/components/index/CategorySection";
import { AppFooter } from "@/components/index/AppFooter";

type Product = Database['public']['Tables']['products']['Row'];

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

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true);
  
  if (error) throw error;
  return data || [];
};

const Index = () => {
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    description: string;
    image: string;
  } | null>(null);

  const menuScrollRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const handleCategoryClick = (category: string) => {
    categoryRefs.current[category]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollMenu = (direction: 'left' | 'right') => {
    if (menuScrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? menuScrollRef.current.scrollLeft - scrollAmount
        : menuScrollRef.current.scrollLeft + scrollAmount;
      
      menuScrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        onSignOut={handleSignOut} 
        isAdmin={isAdmin} 
        onCategoryClick={handleCategoryClick}
      />
      <div className="flex flex-1">
        <main className="w-[calc(100%-400px)] px-4 pb-16">
          <div className="flex justify-between items-center mb-2">
            {isAdmin && <AdminButton />}
          </div>

          <div className="relative">
            <button 
              onClick={() => scrollMenu('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
              aria-label="Scroll left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div 
              ref={menuScrollRef}
              className="overflow-x-auto scrollbar-hide py-2 px-8 flex space-x-6 scroll-smooth"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="text-gray-900 whitespace-nowrap font-medium hover:text-primary transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>

            <button 
              onClick={() => scrollMenu('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
              aria-label="Scroll right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="space-y-12 mt-8">
            {categories.map((category) => (
              <CategorySection
                key={category}
                ref={el => categoryRefs.current[category] = el}
                category={category}
                products={products}
                onProductSelect={setSelectedProduct}
              />
            ))}
          </div>
        </main>

        <aside className="w-[400px] fixed top-0 right-0 h-screen z-50">
          <OrderSidebar 
            selectedProduct={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        </aside>
      </div>

      <AppFooter 
        isAdmin={isAdmin}
        isLoggedIn={!!session}
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default Index;