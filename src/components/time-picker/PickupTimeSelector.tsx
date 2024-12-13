import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface PickupTimeSelectorProps {
  selectedDate: Date | undefined;
  availableDays: Date[];
  availableTimes: string[];
  activeTab: string;
  onTabChange: (value: string) => void;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  isDateUnavailable: (date: Date) => boolean;
}

export const PickupTimeSelector = ({
  selectedDate,
  availableDays,
  availableTimes,
  activeTab,
  onTabChange,
  onDateSelect,
  onTimeSelect,
  isDateUnavailable,
}: PickupTimeSelectorProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="date">Date</TabsTrigger>
        <TabsTrigger value="time" disabled={!selectedDate}>Time</TabsTrigger>
      </TabsList>
      <TabsContent value="date" className="p-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={isDateUnavailable}
          initialFocus
        />
      </TabsContent>
      <TabsContent value="time" className="p-4">
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
      </TabsContent>
    </Tabs>
  );
};