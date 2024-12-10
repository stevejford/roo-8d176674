import { Button } from "@/components/ui/button";
import { Send, Printer, Trash2, Plus } from "lucide-react";

interface OrderActionsProps {
  orderId: string;
  onAddItems: (orderId: string) => void;
  onSendToKitchen: (orderId: string) => void;
  onPrintReceipt: (order: any) => void;
  onDelete: (orderId: string) => void;
}

export const OrderActions = ({ 
  orderId, 
  onAddItems, 
  onSendToKitchen, 
  onPrintReceipt,
  onDelete 
}: OrderActionsProps) => {
  return (
    <div className="space-y-2">
      <Button 
        className="w-full bg-[#10B981]"
        onClick={() => onAddItems(orderId)}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Items
      </Button>

      <Button 
        className="w-full bg-[#10B981]"
        onClick={() => onSendToKitchen(orderId)}
      >
        <Send className="w-4 h-4 mr-2" />
        Send to Kitchen
      </Button>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => onPrintReceipt(orderId)}
      >
        <Printer className="w-4 h-4 mr-2" />
        Print Receipt
      </Button>

      <Button 
        variant="destructive"
        className="w-full"
        onClick={() => onDelete(orderId)}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Order
      </Button>
    </div>
  );
};