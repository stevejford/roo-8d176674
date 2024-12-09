import React from "react";
import { HopOff } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  isAdmin: boolean;
  onCategoryClick: (category: string) => void;
  onSignOut?: () => Promise<void>;
}

export const Navbar = ({ isAdmin }: NavbarProps) => {
  const isMobile = useIsMobile();
  
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-3">
          <div className="flex-shrink-0 flex items-center gap-2">
            <HopOff className="h-6 w-6 text-primary" />
            <h1 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>Roo Restaurant</h1>
          </div>
          <div className="flex items-center gap-4 ml-auto">
          </div>
        </div>
      </div>
    </nav>
  );
};