import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { AppFooter } from '@/components/index/AppFooter';
import { MainContent } from '@/components/index/MainContent';
import { OrderSidebar } from '@/components/OrderSidebar';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { categories } = useCategories();
  const { products } = useProducts();

  const categoryRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  } | null>(null);

  const handleProductSelect = (product: {
    title: string;
    description: string;
    image: string;
    price: number;
    category_id?: string;
  }) => {
    setSelectedProduct(product);
  };

  const scrollToCategory = (categoryId: string) => {
    const categoryRef = categoryRefs.current[categoryId];
    if (categoryRef) {
      categoryRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Group products by category
  const productsByCategory = React.useMemo(() => {
    return (products || []).reduce((acc, product) => {
      if (product.category_id) {
        if (!acc[product.category_id]) {
          acc[product.category_id] = [];
        }
        acc[product.category_id].push(product);
      }
      return acc;
    }, {} as Record<string, typeof products>);
  }, [products]);

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

      <OrderSidebar
        selectedProduct={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <AppFooter 
        isAdmin={isAdmin}
        isLoggedIn={false}
        onSignOut={() => {}}
      />
    </div>
  );
};

export default Index;