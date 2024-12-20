import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { AppFooter } from '@/components/index/AppFooter';
import { MainContent } from '@/components/index/MainContent';
import { OrderSidebar } from '@/components/OrderSidebar';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Product } from '@/components/admin/products/types';
import { OrderLocation } from '@/components/OrderLocation';
import { useCartStore } from '@/stores/useCartStore';

const Index = () => {
  const navigate = useNavigate();
  const { isAdmin, session } = useAuth();
  const { categories } = useCategories();
  const { products } = useProducts();
  const isMobile = useIsMobile();
  const categoryRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { items } = useCartStore();

  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  } | null>(null);

  const isDesktopWidth = windowWidth >= 1280;
  const [showLocationSheet, setShowLocationSheet] = useState(isDesktopWidth);
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('pickup');

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      
      if (newWidth >= 1280 && !selectedProduct) {
        setShowLocationSheet(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [selectedProduct]);

  const productsByCategory = React.useMemo(() => {
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
    setShowLocationSheet(false);
    setSelectedProduct(product);
  };

  const scrollToCategory = (categoryId: string) => {
    const categoryRef = categoryRefs.current[categoryId];
    if (categoryRef) {
      categoryRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const shouldShowCartButton = (windowWidth < 1280 || isMobile) && !selectedProduct && !showLocationSheet;
  const shouldShowSidebar = windowWidth >= 1280 && !isMobile;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${shouldShowSidebar ? 'mr-[400px]' : ''}`}>
        <Navbar 
          isAdmin={isAdmin} 
          onCategoryClick={scrollToCategory}
        />
      </div>
      
      <div>
        <div className="relative flex">
          <MainContent
            categories={categories || []}
            productsByCategory={productsByCategory}
            categoryRefs={categoryRefs}
            onProductSelect={handleProductSelect}
          />

          {shouldShowSidebar && (
            <div className="fixed top-0 right-0 w-[400px] h-screen">
              <OrderLocation 
                mode={deliveryMode}
                isOpen={showLocationSheet}
                onOpenChange={setShowLocationSheet}
              />
            </div>
          )}
        </div>

        <OrderSidebar
          selectedProduct={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAfterClose={() => {
            if (shouldShowSidebar) {
              setShowLocationSheet(true);
            }
          }}
        />

        {!shouldShowSidebar && (
          <OrderLocation 
            mode={deliveryMode}
            isOpen={showLocationSheet}
            onOpenChange={setShowLocationSheet}
          />
        )}

        {shouldShowCartButton && (
          <button
            onClick={() => setShowLocationSheet(true)}
            className="fixed bottom-0 left-0 right-0 bg-[#D84A4A] text-white py-4 flex items-center justify-center space-x-3 z-50 shadow-lg"
          >
            <span className="text-lg font-medium">View Order</span>
            {items.length > 0 && (
              <div className="flex items-center justify-center bg-white text-[#D84A4A] rounded-full h-6 w-6 font-bold text-sm">
                {items.length}
              </div>
            )}
          </button>
        )}
      </div>

      <AppFooter 
        isAdmin={isAdmin}
        isLoggedIn={!!session}
        onSignOut={() => {}}
      />
    </div>
  );
};

export default Index;