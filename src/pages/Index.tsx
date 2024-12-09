import React, { useState } from 'react';
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

  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  } | null>(null);

  const [showLocationSheet, setShowLocationSheet] = useState(!isMobile);
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery'>('pickup');
  const [cartCount, setCartCount] = useState(2); // This should be dynamic based on your cart state

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

          <div className={`${isMobile ? 'hidden' : 'fixed top-16 right-0 w-[400px] h-[calc(100vh-4rem)] xl:block hidden'}`}>
            <OrderLocation 
              mode={deliveryMode}
              isOpen={showLocationSheet}
              onOpenChange={setShowLocationSheet}
            />
          </div>
        </div>

        <OrderSidebar
          selectedProduct={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAfterClose={() => setShowLocationSheet(true)}
        />

        {/* Cart Button for Mobile/Tablet */}
        {(isMobile || window.innerWidth < 1280) && !selectedProduct && (
          <button
            onClick={() => setShowLocationSheet(true)}
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