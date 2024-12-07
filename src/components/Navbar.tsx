import React from "react";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

const categories = [
  "Popular",
  "Specials",
  "Entrée",
  "Traditional Pizza",
  "Gourmet Pizza",
  "Pasta & Risotto",
  "Garlic Bread",
  "Mains",
  "Desserts",
  "Shakes",
  "Soft Drinks",
];

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold">Pizza & Pasta</h1>
          </div>
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search Menu"
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">About</button>
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
              Sign In
            </button>
          </div>
        </div>
        <div className="overflow-x-auto -mb-px">
          <div className="flex space-x-8 py-4">
            {categories.map((category) => (
              <button
                key={category}
                className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};