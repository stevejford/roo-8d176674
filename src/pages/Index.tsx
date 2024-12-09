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
import { ShoppingCart } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAdmin, session } = useAuth();
  const { categories } = useCategories();
  const { products } = useProducts();
  const isMobile = useIsMobile();
  const categoryRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarWasOpen, setSidebarWasOpen] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  } | null>(null);

  const [showLocationSheet, setShowLocationSheet] = useState(window.innerWidth >= 1280);
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('pickup');
  const [cartCount, setCartCount] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      
      if (newWidth >= 1280) {
        // If we're going back to desktop size and the sidebar was previously open
        setShowLocationSheet(sidebarWasOpen);
      } else {
        // Store the current state before closing
        setSidebarWasOpen(showLocationSheet);
        setShowLocationSheet(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, [showLocationSheet, sidebarWasOpen]);

  // Transform products into category-based structure
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

  const shouldShowCartButton = (windowWidth < 1280 || isMobile) && !selectedProduct;
  const shouldShowSidebar = windowWidth >= 1280 && !isMobile;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        isAdmin={isAdmin} 
        onCategoryClick={scrollToCategory}
      />
      
      <div className="pt-16">
        <div className="relative flex">
          <MainContent
            categories={categories || []}
            productsByCategory={productsByCategory}
            categoryRefs={categoryRefs}
            onProductSelect={handleProductSelect}
          />

          {shouldShowSidebar && (
            <div className="fixed top-16 right-0 w-[400px] h-[calc(100vh-4rem)]">
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
              setSidebarWasOpen(true);
            }
          }}
        />

        {/* Cart Button for Mobile/Tablet */}
        {shouldShowCartButton && (
          <button
            onClick={() => {
              setShowLocationSheet(true);
              setSidebarWasOpen(true);
            }}
            className="fixed bottom-4 right-4 bg-primary text-white rounded-full p-4 shadow-lg flex items-center space-x-2 z-50"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="bg-white text-primary rounded-full h-6 w-6 flex items-center justify-center font-bold">
                {cartCount}
              </span>
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