import { format } from "date-fns";
import { Clock } from "lucide-react";

interface TimeDisplayProps {
  selectedTime: Date | undefined;
  estimatedDeliveryTime: number | null;
  isStoreCurrentlyOpen: boolean;
  mode: 'pickup' | 'delivery';
  currentHour: number;
}

export const TimeDisplay = ({ 
  selectedTime, 
  estimatedDeliveryTime, 
  isStoreCurrentlyOpen,
  mode,
  currentHour
}: TimeDisplayProps) => {
  const getTimeDisplay = () => {
    if (!isStoreCurrentlyOpen) {
      if (currentHour < 12) {
        return "Closed - Preorder available after 12pm";
      }
      return "Preorder available";
    }
    
    if (!selectedTime) {
      return `Pick a ${mode} time`;
    }

    if (mode === 'delivery') {
      return `${format(selectedTime, "hh:mm aa")}${
        estimatedDeliveryTime ? ` (Est. ${estimatedDeliveryTime} mins)` : ''
      }`;
    }

    return format(selectedTime, "MM/dd/yyyy hh:mm aa");
  };

  return (
    <>
      <Clock className="mr-2 h-4 w-4" />
      <span>{getTimeDisplay()}</span>
    </>
  );
};