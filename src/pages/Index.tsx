import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { OrderSidebar } from "@/components/OrderSidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AppFooter } from "@/components/index/AppFooter";
import { CategoryNav } from "@/components/index/CategoryNav";
import { MainContent } from "@/components/index/MainContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMenuData } from "@/hooks/useMenuData";

const Index = () => {
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const isMobile = useIsMobile();
  const categoryRefs = useRef({});

  const { categories = [], products = [], hasError, refetch } = useMenuData();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleCategoryClick = (category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
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

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Menu refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh menu");
    }
  };

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <p className="text-red-600 font-medium mb-2">Unable to load the menu</p>
          <p className="text-gray-600 text-sm">
            Please try refreshing the page. If the problem persists, contact support.
          </p>
        </div>
      </div>
    );
  }

  // Group products by category
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
        onRefresh={handleRefresh}
      />
      <div className="flex flex-1">
        <main className={`${mainContentClass} pb-16`}>
          <CategoryNav
            categories={categories.map(cat => cat.title)}
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