import React from "react";
import { Plus } from "lucide-react";

interface MenuItemProps {
  title: string;
  price: number;
  description: string;
  image: string;
  onClick?: () => void;
}

export const MenuCard = ({ title, price, description, image, onClick }: MenuItemProps) => {
  return (
    <button 
      type="button" 
      className="block w-full text-left"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-lg 2xl:rounded-2.25">
        <div className="relative z-1 w-full pb-[100%] overflow-hidden rounded-lg bg-stone-300 2xl:rounded-2.25 after:absolute after:bottom-0 after:left-0 after:z-2 after:h-1/2 after:w-full after:bg-gradient-to-b after:from-neutral-200/0 after:to-black/50">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 z-1 h-full w-full rounded-lg object-cover object-center 2xl:rounded-2.25"
          />
        </div>
        
        <span className="absolute right-2 top-2 z-3 inline-flex h-7.5 w-7.5 items-center justify-center rounded-full bg-white shadow-cw-second xl:h-8 xl:w-8 2xl:right-2.25 2xl:top-2.25 2xl:h-9 2xl:w-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3.5"
            className="w-4 xl:w-4.5 xl:stroke-3 2xl:w-5 2xl:stroke-3.25"
          >
            <path
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              d="M12.005,4v16 M20,12 H4"
            />
          </svg>
        </span>

        <div className="absolute left-0 top-0 z-3 flex h-full w-full flex-col justify-end rounded-lg px-1.75 py-2.25 2xl:px-2 2xl:py-2.5">
          <div className="flex flex-wrap justify-start items-start gap-2 mb-1.5 last:mb-0 2xl:mb-1.625 2xl:gap-2.25">
            <span className="overflow-hidden max-w-full relative inline-flex items-center justify-center space-x-1.75 border px-4 bg-white border-white text-black font-semibold h-4 text-xs !px-0.75 rounded-1.25 2xl:h-4.5 2xl:text-3.25 2xl:rounded-1.375">
              <span className="block py-0.5 leading-tight tracking-tight uppercase relative top-0.5px !leading-4 !py-0">
                L {price.toFixed(2)}
              </span>
            </span>
          </div>
          <h4 className="mb-1.5 text-xl font-semibold leading-6 text-white last:mb-0 xl:text-5.25 xl:tracking-s-tight 2xl:mb-1.625 2xl:text-5.75 2xl:leading-6.5">
            {title}
          </h4>
        </div>
      </div>
      <div className="mt-1.5 px-0.5 xl:mt-2 2xl:mt-2.25">
        <p className="mb-1 line-clamp-2 text-3.375 font-normal leading-normal text-neutral-525 last:mb-0 xl:text-3.625 xl:tracking-s-tight">
          {description}
        </p>
      </div>
    </button>
  );
};