"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, parse, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAvailableDays, getAvailableTimeSlots } from "@/utils/businessHours";

interface StoreTimePickerProps {
  date?: Date;
  onSelect: (date: Date) => void;
}

export function StoreTimePicker({ date, onSelect }: StoreTimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [availableDays, setAvailableDays] = React.useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load available days when component mounts
  React.useEffect(() => {
    const loadAvailableDays = async () => {
      try {
        const days = await getAvailableDays();
        setAvailableDays(days);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading available days:', error);
        setIsLoading(false);
      }
    };

    loadAvailableDays();
  }, []);

  // Load available times when date changes
  React.useEffect(() => {
    const loadAvailableTimes = async () => {
      if (selectedDate) {
        try {
          const times = await getAvailableTimeSlots(selectedDate);
          setAvailableTimes(times);
        } catch (error) {
          console.error('Error loading available times:', error);
          setAvailableTimes([]);
        }
      }
    };

    if (selectedDate) {
      loadAvailableTimes();
    }
  }, [selectedDate]);

  const handleDateSelect = async (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeSelect = (timeStr: string) => {
    if (selectedDate && timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      setSelectedDate(newDate);
      onSelect(newDate);
      setIsOpen(false);
    }
  };

  const isDateUnavailable = (date: Date) => {
    return !availableDays.some(
      availableDate => 
        startOfDay(availableDate).getTime() === startOfDay(date).getTime()
    );
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-start">
        <CalendarIcon className="mr-2 h-4 w-4" />
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
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "EEEE, MMMM d 'at' h:mm aa")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <div className="flex">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateUnavailable}
            initialFocus
          />
          {selectedDate && availableTimes.length > 0 && (
            <div className="border-l border-gray-200">
              <ScrollArea className="h-[300px] w-[150px]">
                <div className="grid grid-cols-1 gap-1 p-2">
                  {availableTimes.map((time) => {
                    const formattedTime = format(
                      parse(time, 'HH:mm', new Date()),
                      'h:mm aa'
                    );
                    return (
                      <Button
                        key={time}
                        variant="ghost"
                        className="w-full justify-start font-normal"
                        onClick={() => handleTimeSelect(time)}
                      >
                        {formattedTime}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}