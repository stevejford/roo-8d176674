"use client";

import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAvailableDays, getAvailableTimeSlots } from "@/utils/businessHours";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

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

  React.useEffect(() => {
    const loadAvailableDays = async () => {
      try {
        if (mode === 'delivery') {
          // For delivery, we only need today
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
          // Fetch delivery time estimate for the postcode
          const { data: zoneData, error } = await supabase
            .from('delivery_zones')
            .select('estimated_minutes')
            .eq('postcode', postcode)
            .eq('active', true)
            .single();

          if (error) throw error;

          if (zoneData) {
            setEstimatedDeliveryTime(zoneData.estimated_minutes);
            
            // Generate time slots starting from current time + estimated delivery time
            const now = new Date();
            const startTime = new Date(now.getTime() + (zoneData.estimated_minutes * 60000));
            const times: string[] = [];
            
            // Generate time slots for the next 3 hours
            for (let i = 0; i < 12; i++) {
              const slotTime = new Date(startTime.getTime() + (i * 15 * 60000));
              times.push(format(slotTime, 'HH:mm'));
            }
            
            setAvailableTimes(times);
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
  }, [selectedDate, mode, postcode]);

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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="date">Date</TabsTrigger>
              <TabsTrigger value="time" disabled={!selectedDate}>Time</TabsTrigger>
            </TabsList>
            <TabsContent value="date" className="p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
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
                    onClick={() => handleTimeSelect(time)}
                    className="w-full"
                  >
                    {format(new Date(`2000-01-01T${time}`), 'h:mm aa')}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
              {availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedDate && format(selectedDate, 'HH:mm') === time ? "default" : "outline"}
                  onClick={() => handleTimeSelect(time)}
                  className="w-full"
                >
                  {format(new Date(`2000-01-01T${time}`), 'h:mm aa')}
                </Button>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}