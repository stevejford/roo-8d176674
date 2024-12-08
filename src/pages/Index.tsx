import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { OrderSidebar } from "@/components/OrderSidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { AppFooter } from "@/components/index/AppFooter";
import { CategoryNav } from "@/components/index/CategoryNav";
import { MainContent } from "@/components/index/MainContent";
import { useIsMobile } from "@/hooks/use-mobile";

type Product = Database['public']['Tables']['products']['Row'];

const Index = () => {
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    description: string;
    image: string;
  } | null>(null);
  const isMobile = useIsMobile();

  const menuScrollRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    },
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('position');
      
      if (error) throw error;
      return data;
    },
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

  const handleProductSelect = (product: { title: string; description: string; image: string }) => {
    setSelectedProduct(product);
  };

  const handleCloseSidebar = () => {
    setSelectedProduct(null);
  };

  if (isLoading) {
    return null;
  }

  // Group products by category
  const productsByCategory = products.reduce((acc: { [key: string]: Product[] }, product) => {
    const categoryId = product.category_id || 'uncategorized';
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(product);
    return acc;
  }, {});

  const shouldShowSidebar = (!isMobile && selectedProduct) || (isMobile && selectedProduct);
  const mainContentClass = shouldShowSidebar && !isMobile ? 'lg:w-[calc(100%-400px)]' : 'w-full';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        onSignOut={handleSignOut} 
        isAdmin={isAdmin} 
        onCategoryClick={handleCategoryClick}
      />
      <div className="flex flex-1">
        <main className={`${mainContentClass} pb-16`}>
          <CategoryNav
            categories={categories}
            onCategoryClick={handleCategoryClick}
            onScroll={scrollMenu}
            scrollRef={menuScrollRef}
          />
          <MainContent
            categories={categories}
            productsByCategory={productsByCategory}
            categoryRefs={categoryRefs}
            onProductSelect={handleProductSelect}
          />
        </main>

        {shouldShowSidebar && (
          <aside className={`${
            !isMobile 
              ? 'w-[400px] fixed top-0 right-0 h-screen'
              : 'fixed inset-0'
          } z-50 ${
            isMobile ? 'animate-slide-in-right' : ''
          }`}>
            <OrderSidebar 
              selectedProduct={selectedProduct}
              onClose={handleCloseSidebar}
            />
          </aside>
        )}
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