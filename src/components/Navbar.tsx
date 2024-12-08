import React from "react";
import { HopOff, LogOut, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";

interface NavbarProps {
  onSignOut: () => void;
  isAdmin: boolean;
  onCategoryClick: (category: string) => void;
  onRefresh?: () => void;
}

export const Navbar = ({ onSignOut, isAdmin, onRefresh }: NavbarProps) => {
  const isMobile = useIsMobile();
  
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-3">
          <div className="flex-shrink-0 flex items-center gap-2">
            <HopOff className="h-6 w-6 text-primary" />
            <h1 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>Roo Restaurant</h1>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            {isAdmin && (
              <>
                <span className="text-sm font-medium text-primary">Admin</span>
                {onRefresh && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRefresh}
                    className="text-gray-600 hover:text-primary transition-colors"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                )}
              </>
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