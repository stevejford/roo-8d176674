import React from "react";

interface CategoryNavProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
}

export const CategoryNav = React.forwardRef<HTMLDivElement, CategoryNavProps>(
  ({ categories, onCategoryClick }, ref) => {
    return (
      <div className="w-full py-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryClick(category)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

CategoryNav.displayName = 'CategoryNav';