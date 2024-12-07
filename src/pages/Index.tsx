import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MenuCard } from "@/components/MenuCard";
import { OrderSidebar } from "@/components/OrderSidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true);
  
  if (error) throw error;
  return data;
};

const Index = () => {
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    description: string;
    image: string;
  } | null>(null);

  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleCategoryClick = (category: string) => {
    categoryRefs.current[category]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        onSignOut={handleSignOut} 
        isAdmin={isAdmin} 
        onCategoryClick={handleCategoryClick}
      />
      <div className="relative flex">
        {/* Main content area */}
        <main className="w-[calc(100%-400px)] px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold leading-tight tracking-normal text-left last:mb-0 text-primary-title text-7 capitalize lg:text-7.375 lg:tracking-tight 2xl:text-8.125">
              Menu
            </h2>
            {isAdmin && (
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Admin Dashboard
              </button>
            )}
          </div>

          <div className="space-y-12">
            {categories.map((category) => (
              <div 
                key={category}
                ref={el => categoryRefs.current[category] = el}
                className="scroll-mt-24"
              >
                <h3 className="text-2xl font-bold text-primary-title mb-6">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products?.filter(item => true) // Replace with actual category filtering when available
                    .map((item) => (
                      <MenuCard 
                        key={item.id}
                        title={item.title}
                        price={24.00}
                        description={item.description || ''}
                        image={item.image_url || '/placeholder.svg'}
                        onClick={() => setSelectedProduct({
                          title: item.title,
                          description: item.description || '',
                          image: item.image_url || '/placeholder.svg'
                        })}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-[400px] fixed top-0 right-0 h-screen z-50">
          <OrderSidebar 
            selectedProduct={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        </aside>
      </div>
    </div>
  );
};

export default Index;
