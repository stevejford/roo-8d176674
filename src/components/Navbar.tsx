import React, { useState } from "react";
import { Search, HopOff, LogOut } from "lucide-react";
import { Input } from "./ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface NavbarProps {
  onSignOut: () => void;
  isAdmin: boolean;
  onCategoryClick: (category: string) => void;
}

export const Navbar = ({ onSignOut, isAdmin, onCategoryClick }: NavbarProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [] } = useQuery({
    queryKey: ['searchProducts', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('title', `%${searchQuery}%`)
        .limit(5);
      return data || [];
    },
  });

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (productTitle: string) => {
    const product = products.find(p => p.title === productTitle);
    if (product && product.category_id) {
      supabase
        .from('categories')
        .select('title')
        .eq('id', product.category_id)
        .single()
        .then(({ data }) => {
          if (data) {
            onCategoryClick(data.title);
          }
        });
    }
    setOpen(false);
  };

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
                <button onClick={() => window.location.href = '/admin'} className="text-gray-600 hover:text-primary">
                  <HopOff className="h-5 w-5" />
                </button>
              )}
              <button onClick={onSignOut} className="text-gray-600 hover:text-primary">
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
        <CommandInput 
          placeholder="Search menu items..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Products">
            {products.map((product) => (
              <CommandItem
                key={product.id}
                value={product.title}
                onSelect={handleSearch}
                className="flex items-center gap-2 cursor-pointer"
              >
                {product.image_url && (
                  <img 
                    src={product.image_url} 
                    alt={product.title} 
                    className="w-8 h-8 object-cover rounded"
                  />
                )}
                <div>
                  <div className="font-medium">{product.title}</div>
                  <div className="text-sm text-gray-500">
                    ${product.price?.toFixed(2)}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </nav>
  );
};