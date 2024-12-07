import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MenuCard } from "@/components/MenuCard";
import { OrderSidebar } from "@/components/OrderSidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!session || isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="flex-1 min-w-0">
        <Navbar onSignOut={handleSignOut} isAdmin={isAdmin} />
        <main>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((item) => (
                <MenuCard 
                  key={item.id}
                  title={item.title}
                  price={24.00} // This should come from the sizes array in a real implementation
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
        </main>
      </div>
      <OrderSidebar 
        selectedProduct={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Index;