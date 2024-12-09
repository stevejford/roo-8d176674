import React from "react";
import { X } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { useToast } from "@/components/ui/use-toast";

interface ProductDetailsProps {
  title: string;
  description: string;
  image: string;
  price: number;
  category_id?: string;
  onClose: () => void;
}

export const ProductDetails = ({ 
  title, 
  description, 
  image, 
  price,
  category_id,
  onClose 
}: ProductDetailsProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: Math.random().toString(36).substr(2, 9), // Temporary ID generation
      title,
      price,
      image_url: image,
    });

    toast({
      title: "Added to Order",
      description: `${title} has been added to your order.`,
      variant: "default",
    });

    onClose();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full aspect-square object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6 flex-1">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="p-6 mt-auto">
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary text-white py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <span>Add to Order</span>
          <span>${price.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};