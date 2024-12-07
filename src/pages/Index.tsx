import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MenuCard } from "@/components/MenuCard";
import { OrderSidebar } from "@/components/OrderSidebar";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

const popularItems = [
  {
    title: "The Stewart",
    price: 24.00,
    description: "Tomato, cheese, pepperoni and a sprinkle of parmesan. Topped with fresh basil.",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "The Duncan",
    price: 24.00,
    description: "BBQ sauce base, cheese, bacon, onion, pineapple with cheese on top!",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Arancini",
    price: 11.90,
    description: "Delicious fried balls of rice with 3 flavours to choose from.",
    image: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&auto=format&fit=crop&q=60",
  },
  {
    title: "Southwest Chicken",
    price: 28.00,
    description: "Tomato sauce base, Cheese, Chicken, Onion, Fresh Capsicum, topped with Southwest sauce.",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=60",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { session, isAdmin } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    description: string;
    image: string;
  } | null>(null);

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="flex-1 min-w-0">
        <Navbar onSignOut={handleSignOut} isAdmin={isAdmin} />
        <main>
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold leading-tight tracking-normal text-left last:mb-0 text-primary-title text-7 capitalize lg:text-7.375 lg:tracking-tight 2xl:text-8.125">
                Popular
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
              {popularItems.map((item) => (
                <MenuCard 
                  key={item.title} 
                  {...item} 
                  onClick={() => setSelectedProduct(item)}
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