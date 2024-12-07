import React from "react";
import { Plus } from "lucide-react";

interface SpecialCardProps {
  title: string;
  price: number;
  description: string;
  image: string;
  onClick?: () => void;
}

export const SpecialCard = ({ title, price, description, image, onClick }: SpecialCardProps) => {
  return (
    <button 
      type="button" 
      className="block w-full text-left h-full"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative z-1 w-full pb-[56.25%] overflow-hidden rounded-lg bg-stone-300 after:absolute after:bottom-0 after:left-0 after:z-2 after:h-1/2 after:w-full after:bg-gradient-to-b after:from-neutral-200/0 after:to-black/50">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 z-1 h-full w-full rounded-lg object-cover object-center"
          />
        </div>
        
        <span className="absolute right-2 top-2 z-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg xl:h-9 xl:w-9">
          <Plus className="h-5 w-5" />
        </span>

        <div className="absolute left-0 top-0 z-3 flex h-full w-full flex-col justify-end rounded-lg px-4 py-4">
          <div className="flex flex-wrap justify-start items-start gap-2 mb-2">
            <span className="overflow-hidden max-w-full relative inline-flex items-center justify-center border px-4 bg-white border-white text-black font-semibold h-6 text-sm rounded-md">
              <span className="block py-0.5 leading-tight tracking-tight">
                L {price.toFixed(2)}
              </span>
            </span>
          </div>
          <h4 className="mb-2 text-2xl font-bold leading-tight text-white">
            {title}
          </h4>
          <p className="text-sm text-white/90 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
};