import React, { useState } from "react";
import { Search, HopOff, LogOut } from "lucide-react";
import { Input } from "./ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  onSignOut: () => void;
  isAdmin: boolean;
  onCategoryClick: (category: string) => void;
  onSearch?: (query: string) => void;
}

export const Navbar = ({ onSignOut, isAdmin, onSearch }: NavbarProps) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-3">
          <div className="flex-shrink-0 flex items-center gap-2">
            <HopOff className="h-6 w-6 text-primary" />
            <h1 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>Roo Restaurant</h1>
          </div>
          {!isMobile && (
            <div className="flex-1 max-w-[280px]">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search Menu"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pr-12 h-9 text-sm rounded-full border-gray-200 placeholder:text-gray-500"
                />
                <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2">
                  <button className="p-1.5 bg-white rounded-full hover:bg-gray-50 transition-colors shadow-sm">
                    <Search className="h-3.5 w-3.5 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 ml-auto">
            {isAdmin && (
              <span className="text-sm font-medium text-primary">Admin</span>
            )}
            <button
              onClick={onSignOut}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};