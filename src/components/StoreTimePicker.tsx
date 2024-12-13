import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAvailableDays, getAvailableTimeSlots, isStoreOpen } from "@/utils/businessHours";
import { supabase } from "@/integrations/supabase/client";
import { DeliveryTimeSlots } from "./time-picker/DeliveryTimeSlots";
import { PickupTimeSelector } from "./time-picker/PickupTimeSelector";

interface StoreTimePickerProps {
  date?: Date;
  onSelect: (date: Date) => void;
  mode?: 'pickup' | 'delivery';
  postcode?: string;
}

export function StoreTimePicker({ date, onSelect, mode = 'pickup', postcode }: StoreTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [isOpen, setIsOpen] = React.useState(false);
  const [availableDays, setAvailableDays] = React.useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("time");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = React.useState<number | null>(null);
  const [isStoreCurrentlyOpen, setIsStoreCurrentlyOpen] = React.useState(false);

  React.useEffect(() => {
    const checkStoreStatus = async () => {
      const storeOpen = await isStoreOpen();
      setIsStoreCurrentlyOpen(storeOpen);
    };

    checkStoreStatus();
  }, []);

  React.useEffect(() => {
    const loadAvailableDays = async () => {
      try {
        if (mode === 'delivery') {
          setAvailableDays([new Date()]);
        } else {
          const days = await getAvailableDays();
          setAvailableDays(days);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading available days:', error);
        setIsLoading(false);
      }
    };

    loadAvailableDays();
  }, [mode]);

  React.useEffect(() => {
    const loadAvailableTimes = async () => {
      if (mode === 'delivery' && postcode) {
        try {
          if (!isStoreCurrentlyOpen) {
            setAvailableTimes([]);
            return;
          }

          const { data: zoneData, error } = await supabase
            .from('delivery_zones')
            .select('estimated_minutes')
            .eq('postcode', postcode)
            .eq('active', true)
            .single();

          if (error) throw error;

          if (zoneData) {
            setEstimatedDeliveryTime(zoneData.estimated_minutes);
            
            // Get available times based on store hours
            const times = await getAvailableTimeSlots(new Date());
            
            // Filter times to ensure they're after current time + delivery estimate
            const now = new Date();
            const minDeliveryTime = new Date(now.getTime() + (zoneData.estimated_minutes * 60000));
            
            const filteredTimes = times.filter(time => {
              const [hours, minutes] = time.split(':').map(Number);
              const timeDate = new Date();
              timeDate.setHours(hours, minutes, 0, 0);
              return timeDate > minDeliveryTime;
            });
            
            setAvailableTimes(filteredTimes);
          }
        } catch (error) {
          console.error('Error loading delivery times:', error);
          setAvailableTimes([]);
        }
      } else if (selectedDate) {
        try {
          const times = await getAvailableTimeSlots(selectedDate);
          setAvailableTimes(times);
        } catch (error) {
          console.error('Error loading available times:', error);
          setAvailableTimes([]);
        }
      }
    };

    if (mode === 'delivery' || selectedDate) {
      loadAvailableTimes();
    }
  }, [selectedDate, mode, postcode, isStoreCurrentlyOpen]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = selectedDate 
        ? new Date(date.setHours(selectedDate.getHours(), selectedDate.getMinutes()))
        : new Date(date.setHours(12, 0));
      setSelectedDate(newDate);
      setActiveTab("time");
    }
  };

  const handleTimeSelect = (timeString: string) => {
    const today = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(today.setHours(hours, minutes));
    setSelectedDate(newDate);
    onSelect(newDate);
    setIsOpen(false);
  };

  const isDateUnavailable = (date: Date) => {
    return !availableDays.some(
      availableDate => 
        new Date(availableDate).setHours(0,0,0,0) === new Date(date).setHours(0,0,0,0)
    );
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-start">
        <Clock className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedDate ? (
            mode === 'delivery' ? (
              <span>
                {format(selectedDate, "hh:mm aa")}
                {estimatedDeliveryTime && ` (Est. ${estimatedDeliveryTime} mins)`}
              </span>
            ) : (
              format(selectedDate, "MM/dd/yyyy hh:mm aa")
            )
          ) : (
            <span>Pick a {mode === 'delivery' ? 'delivery' : 'pickup'} time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white">
        {mode === 'pickup' ? (
          <PickupTimeSelector
            selectedDate={selectedDate}
            availableDays={availableDays}
            availableTimes={availableTimes}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onDateSelect={handleDateSelect}
            onTimeSelect={handleTimeSelect}
            isDateUnavailable={isDateUnavailable}
          />
        ) : (
          <DeliveryTimeSlots
            availableTimes={availableTimes}
            selectedDate={selectedDate}
            estimatedDeliveryTime={estimatedDeliveryTime}
            onTimeSelect={handleTimeSelect}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}