import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { MenuCard } from "@/components/MenuCard";
import { OrderSidebar } from "@/components/OrderSidebar";

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
  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    description: string;
    image: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <div className="flex-1 min-w-0">
        <Navbar />
        <main>
          <div className="container mx-auto px-4 py-8">
            <h2 className="font-bold leading-tight tracking-normal text-left mb-4 last:mb-0 text-primary-title text-7 capitalize lg:text-7.375 lg:tracking-tight 2xl:text-8.125 2xl:mb-4.5">
              Popular
            </h2>
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