import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { OrderSidebar } from "@/components/OrderSidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppFooter } from "@/components/index/AppFooter";
import { CategoryNav } from "@/components/index/CategoryNav";
import { MainContent } from "@/components/index/MainContent";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const isMobile = useIsMobile();
  const categoryRefs = useRef({});

  // Add console logs for debugging
  console.log("Index component rendering");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log("Fetching categories");
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position');
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      console.log("Categories fetched:", data);
      return data;
    },
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log("Fetching products");
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('position');
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      console.log("Products fetched:", data);
      return data;
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const handleCategoryClick = (category: string) => {
    console.log("Category clicked:", category);
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleProductSelect = (product: { title: string; description: string; image: string }) => {
    console.log("Product selected:", product);
    setSelectedProduct(product);
  };

  const handleCloseSidebar = () => {
    setSelectedProduct(null);
  };

  if (categoriesLoading || productsLoading) {
    return null;
  }

  const productsByCategory = products.reduce((acc, product) => {
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