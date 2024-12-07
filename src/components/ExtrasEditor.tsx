import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";

interface Extra {
  name: string;
  price: number;
}

interface ExtrasCategory {
  name: string;
  items: Extra[];
}

interface ExtrasEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const extrasData: ExtrasCategory[] = [
  {
    name: "Popular",
    items: [
      { name: "Cheese (Pizza Type) on Top", price: 1.00 },
      { name: "Chicken", price: 1.00 },
      { name: "Egg", price: 1.00 },
      { name: "Lamb", price: 1.00 },
      { name: "Pepperoni (Spicy)", price: 1.00 },
      { name: "Prosciutto", price: 1.00 },
      { name: "Vegan Cheese on Top", price: 1.00 },
      { name: "Virginian Ham", price: 1.00 }
    ]
  },
  {
    name: "Garnish",
    items: [
      { name: "Chilli", price: 1.00 },
      { name: "Herbs", price: 1.00 },
      { name: "Pinenuts", price: 1.00 },
      { name: "Walnuts", price: 1.00 }
    ]
  },
  {
    name: "Seafood",
    items: [
      { name: "Anchovies", price: 1.00 },
      { name: "Prawns", price: 1.00 },
      { name: "Seafood Mix (Contains Prawns)", price: 1.00 },
      { name: "Tiger Prawns", price: 2.00 }
    ]
  },
  {
    name: "Sauce",
    items: [
      { name: "Aioli", price: 1.00 },
      { name: "BBQ Sauce on Top", price: 1.00 },
      { name: "Blue Cheese Sauce", price: 1.00 },
      { name: "Buffalo Sauce", price: 1.00 },
      { name: "Hot Honey (Spicy)", price: 1.00 },
      { name: "Pesto (Contains Nuts)", price: 1.00 },
      { name: "Ranch Sauce", price: 1.00 },
      { name: "Satay Sauce", price: 1.00 },
      { name: "Satay Sauce (Contains Nuts/Gluten)", price: 1.00 },
      { name: "Southwest Sauce", price: 1.00 },
      { name: "Tomato Sauce on Top", price: 1.00 }
    ]
  },
  {
    name: "Vegetables",
    items: [
      { name: "Avocado", price: 1.00 },
      { name: "Fresh Capsicum", price: 1.00 },
      { name: "Fresh Tomato", price: 1.00 },
      { name: "Garlic", price: 1.00 },
      { name: "Green Olives", price: 1.00 },
      { name: "Jalapeño", price: 1.00 },
      { name: "Mushroom", price: 1.00 },
      { name: "Olives - Black", price: 1.00 },
      { name: "Onion", price: 1.00 },
      { name: "Pumpkin", price: 1.00 },
      { name: "Roasted Capsicum", price: 1.00 },
      { name: "Roasted Eggplant", price: 1.00 },
      { name: "Semi Dried Tomato", price: 1.00 },
      { name: "Spinach", price: 1.00 }
    ]
  },
  {
    name: "Cheese",
    items: [
      { name: "Bocconcini Cheese", price: 1.00 },
      { name: "Cheese (Pizza Type) on Top", price: 1.00 },
      { name: "Fetta Cheese", price: 1.00 },
      { name: "Parmesan Cheese", price: 1.00 },
      { name: "Vegan Cheese on Top", price: 1.00 }
    ]
  },
  {
    name: "Meat",
    items: [
      { name: "Bacon", price: 1.00 },
      { name: "Chicken", price: 1.00 },
      { name: "Egg", price: 1.00 },
      { name: "Ham (Pizza Type)", price: 1.00 },
      { name: "Hot Salami", price: 1.00 },
      { name: "Lamb", price: 1.00 },
      { name: "Meatballs", price: 1.00 },
      { name: "Pepperoni (Spicy)", price: 1.00 },
      { name: "Prosciutto", price: 1.00 },
      { name: "Virginian Ham", price: 1.00 }
    ]
  }
];

export const ExtrasEditor = ({ isOpen, onClose }: ExtrasEditorProps) => {
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleQuantityChange = (itemName: string, increment: boolean) => {
    setQuantities(prev => ({
      ...prev,
      [itemName]: Math.max(0, (prev[itemName] || 0) + (increment ? 1 : -1))
    }));
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollToCategory = (categoryName: string) => {
    const element = categoryRefs.current[categoryName];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#2D3648]">Add Extras</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-lg rounded-full hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide py-2 px-8 flex space-x-6 scroll-smooth"
          >
            {extrasData.map((category) => (
              <button
                key={category.name}
                onClick={() => scrollToCategory(category.name)}
                className="text-[#2D3648] whitespace-nowrap text-sm font-medium hover:text-primary transition-colors"
              >
                {category.name}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-lg rounded-full hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <div className="space-y-6">
            {extrasData.map((category) => (
              <div 
                key={category.name}
                ref={el => categoryRefs.current[category.name] = el}
              >
                <h3 className="text-lg font-semibold text-[#2D3648] mb-3 capitalize">
                  {category.name}
                </h3>
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <div 
                      key={item.name}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <div>
                        <span className="text-[#2D3648]">{item.name}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(item.name, false)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          type="button"
                        >
                          <Minus className="h-5 w-5 text-gray-400" />
                        </button>
                        <span className="w-4 text-center">
                          {quantities[item.name] || 0}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.name, true)}
                          className="p-1 rounded-full hover:bg-gray-100"
                          type="button"
                        >
                          <Plus className="h-5 w-5 text-[#E86452]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};