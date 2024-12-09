import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { AppFooter } from '@/components/index/AppFooter';
import { MainContent } from '@/components/index/MainContent';
import { OrderSidebar } from '@/components/OrderSidebar';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/components/admin/products/types';
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { OrderLocation } from '@/components/OrderLocation';

const Index = () => {
  const navigate = useNavigate();
  const { isAdmin, session } = useAuth();
  const { categories } = useCategories();
  const { products } = useProducts();
  const categoryRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [showLocationSidebar, setShowLocationSidebar] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  } | null>(null);

  // Transform products into category-based structure
  const productsByCategory = useMemo(() => {
    if (!products) return {};
    
    return products.reduce((acc: { [key: string]: Product[] }, product) => {
      const categoryId = product.category_id || 'uncategorized';
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(product);
      return acc;
    }, {});
  }, [products]);

  const handleProductSelect = (product: {
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  }) => {
    setShowLocationSidebar(false);
    setSelectedProduct(product);
  };

  const scrollToCategory = (categoryId: string) => {
    const categoryRef = categoryRefs.current[categoryId];
    if (categoryRef) {
      categoryRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        isAdmin={isAdmin} 
        onCategoryClick={scrollToCategory}
      />
      
      <div className="pt-16">
        <MainContent
          categories={categories || []}
          productsByCategory={productsByCategory}
          categoryRefs={categoryRefs}
          onProductSelect={handleProductSelect}
        />
      </div>

      <Sidebar open={showLocationSidebar} onOpenChange={setShowLocationSidebar}>
        <SidebarContent className="w-[400px] sm:w-[540px] p-6">
          <OrderLocation mode="delivery" />
        </SidebarContent>
      </Sidebar>

      <OrderSidebar
        selectedProduct={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAfterClose={() => setShowLocationSidebar(true)}
      />

      <AppFooter 
        isAdmin={isAdmin}
        isLoggedIn={!!session}
        onSignOut={() => {}} // This will be handled by the AppFooter component internally
      />
    </div>
  );
};

export default Index;