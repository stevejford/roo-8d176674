import React, { useState, useEffect } from "react";
import { HopOff, LogOut, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type NavbarProps = {
  onSignOut: () => void;
  isAdmin: boolean;
  onCategoryClick: (category: string) => void;
};

export const Navbar = ({ onSignOut, isAdmin, onCategoryClick }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("active", true);
      if (error) throw error;
      return data;
    },
  });

  const handleSearch = (productTitle: string) => {
    const product = products.find(p => p.title === productTitle);
    if (product && product.category_id) {
      supabase
        .from('categories')
        .select('title')
        .eq('id', product.category_id)
        .single()
        .then(({ data }) => {
          if (data?.title) {
            onCategoryClick(data.title);
            setOpen(false);
          }
        });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary">Menu</h1>
            </div>
            {!isMobile && (
              <div className="flex-1 max-w-lg mx-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search menu... (⌘ K)"
                    className="w-full pr-12 h-9 text-sm rounded-full border-gray-200 placeholder:text-gray-500"
                    onClick={() => setOpen(true)}
                    readOnly
                    aria-label="Search menu"
                  />
                  <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2">
                    <button 
                      className="p-1.5 bg-white rounded-full hover:bg-gray-50 transition-colors shadow-sm"
                      onClick={() => setOpen(true)}
                      aria-label="Open search"
                    >
                      <Search className="h-3.5 w-3.5 text-primary" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <button 
                  onClick={() => window.location.href = '/admin'} 
                  className="text-gray-600 hover:text-primary"
                  aria-label="Go to admin panel"
                >
                  <HopOff className="h-5 w-5" />
                </button>
              )}
              <button 
                onClick={onSignOut} 
                className="text-gray-600 hover:text-primary"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <CommandDialog 
        open={open} 
        onOpenChange={setOpen}
        aria-label="Search menu items"
      >
        <div className="flex flex-col">
          <CommandInput 
            placeholder="Search menu items..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            aria-label="Search input"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Menu Items">
              {filteredProducts.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.title}
                  onSelect={handleSearch}
                  className="flex items-center gap-2 p-2"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{product.title}</span>
                    {product.price && (
                      <span className="text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      </CommandDialog>
    </nav>
  );
};