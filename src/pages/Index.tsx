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
  const { isAdmin, session } = useAuth();
  const { categories } = useCategories();
  const { productsByCategory } = useProducts();
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
        isLoggedIn={!!session}
        onSignOut={() => {}} // This will be handled by the AppFooter component internally
      />
    </div>
  );
};

export default Index;