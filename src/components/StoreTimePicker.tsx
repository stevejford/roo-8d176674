"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getAvailableDays, getAvailableTimeSlots } from "@/utils/businessHours";

interface StoreTimePickerProps {
  date?: Date;
  onSelect: (date: Date) => void;
}

export function StoreTimePicker({ date, onSelect }: StoreTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [isOpen, setIsOpen] = React.useState(false);
  const [availableDays, setAvailableDays] = React.useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (type === "hour") {
        newDate.setHours(
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
        );
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();
        newDate.setHours(
          value === "PM" ? currentHours + 12 : currentHours - 12
        );
      }
      setSelectedDate(newDate);
      onSelect(newDate);
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
            format(selectedDate, "MM/dd/yyyy hh:mm aa")
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={isDateUnavailable}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      selectedDate && selectedDate.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      selectedDate && selectedDate.getMinutes() === minute
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea>
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      selectedDate &&
                      ((ampm === "AM" && selectedDate.getHours() < 12) ||
                        (ampm === "PM" && selectedDate.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}