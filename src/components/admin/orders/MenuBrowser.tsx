import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MenuCard } from '@/components/MenuCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

interface MenuBrowserProps {
  onOrderComplete?: () => void;
}

export const MenuBrowser = ({ onOrderComplete }: MenuBrowserProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedTable = location.state?.selectedTable;
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*, products(*)')
        .order('position');
      
      if (error) throw error;
      return data;
    }
  });

  const handleProductSelect = async (product: any) => {
    if (!selectedTable) {
      toast({
        title: "No table selected",
        description: "Please select a table first.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Check if there's an existing pending order for the table
      const { data: existingOrders, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('table_number', selectedTable.table_number)
        .eq('status', 'pending')
        .single();

      let orderId;

      if (existingOrders) {
        orderId = existingOrders.id;
      } else {
        // Create a new order for the table
        const { data: order, error: newOrderError } = await supabase
          .from('orders')
          .insert({
            table_number: selectedTable.table_number,
            status: 'pending',
          })
          .select()
          .single();

        if (newOrderError) throw newOrderError;
        orderId = order.id;
      }

      // Add the product to the order
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderId,
          product_id: product.id,
          price: product.price,
          quantity: 1
        });

      if (itemError) throw itemError;

      // Update table status
      const { error: tableError } = await supabase
        .from('tables')
        .update({ status: 'occupied' })
        .eq('id', selectedTable.id);

      if (tableError) throw tableError;

      toast({
        title: "Item added",
        description: `${product.title} has been added to the order`,
      });

      // Navigate back to the tables view
      navigate('/admin/waiter');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to add item to order",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Menu</h2>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-8">
          {categories?.map((category) => (
            <div key={category.id} className="space-y-4">
              <h3 className="text-xl font-semibold">{category.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.products?.map((product) => (
                  <MenuCard
                    key={product.id}
                    title={product.title}
                    price={product.price}
                    description={product.description || ''}
                    image={product.image_url || ''}
                    onClick={() => handleProductSelect(product)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};