import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface TimeSlotsProps {
  availableTimes: string[];
  selectedDate: Date | undefined;
  onTimeSelect: (time: string) => void;
}

export const TimeSlots = ({ availableTimes, selectedDate, onTimeSelect }: TimeSlotsProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
      {availableTimes.map((time) => (
        <Button
          key={time}
          variant={selectedDate && format(selectedDate, 'HH:mm') === time ? "default" : "outline"}
          onClick={() => onTimeSelect(time)}
          className="w-full"
        >
          {format(new Date(`2000-01-01T${time}`), 'h:mm aa')}
        </Button>
      ))}
    </div>
  );
};