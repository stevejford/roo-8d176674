"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getAvailableDays, getAvailableTimeSlots } from "@/utils/businessHours";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = React.useState("date");

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
      const newDate = selectedDate 
        ? new Date(date.setHours(selectedDate.getHours(), selectedDate.getMinutes()))
        : new Date(date.setHours(12, 0));
      setSelectedDate(newDate);
      setActiveTab("time");
    }
  };

  const handleTimeSelect = (timeString: string) => {
    if (selectedDate) {
      const [hours, minutes] = timeString.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      setSelectedDate(newDate);
      onSelect(newDate);
    }
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
      </PopoverContent>
    </Popover>
  );
}