import React from "react";

interface CategoryNavProps {
  categories: any[];
  onCategoryClick: (category: string) => void;
}

export const CategoryNav = ({ categories, onCategoryClick }: CategoryNavProps) => {
  return (
    <div className="sticky top-16 bg-gray-50 z-40">
      <div className="relative py-4 max-w-[1400px] mx-auto px-4">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick(category.title)}
              className="text-gray-900 whitespace-nowrap font-medium hover:text-primary transition-colors px-3 py-2 rounded-full bg-white shadow-sm"
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};