import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parse } from "date-fns";
import { getAvailableDays, getAvailableTimeSlots } from "@/utils/businessHours";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PickupTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string, time: string) => void;
}

export const PickupTimeModal = ({ isOpen, onClose, onSchedule }: PickupTimeModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAvailableDays = async () => {
      try {
        const days = await getAvailableDays();
        setAvailableDays(days);
        if (days.length > 0) {
          setSelectedDate(days[0]);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading available days:', error);
        setIsLoading(false);
      }
    };

    loadAvailableDays();
  }, []);

  useEffect(() => {
    const loadAvailableTimes = async () => {
      if (selectedDate) {
        try {
          const times = await getAvailableTimeSlots(selectedDate);
          setAvailableTimes(times);
          setSelectedTime(times[0] || "");
        } catch (error) {
          console.error('Error loading available times:', error);
        }
      }
    };

    loadAvailableTimes();
  }, [selectedDate]);

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      onSchedule(
        format(selectedDate, "EEEE, MMMM d"),
        format(parse(selectedTime, 'HH:mm', new Date()), "h:mm aa")
      );
    }
  };

  if (isLoading) {
    return null; // Or show a loading spinner
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#2D3648]">
            Select a Pickup Time
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Select
            value={selectedDate.toISOString()}
            onValueChange={(value) => setSelectedDate(new Date(value))}
          >
            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 shadow-sm">
              <SelectValue>
                {format(selectedDate, "EEEE, MMMM d")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              {availableDays.map((day) => (
                <SelectItem 
                  key={day.toISOString()} 
                  value={day.toISOString()}
                  className="hover:bg-gray-100 cursor-pointer text-gray-900"
                >
                  {format(day, "EEEE, MMMM d")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTime}
            onValueChange={setSelectedTime}
          >
            <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900 shadow-sm">
              <SelectValue>
                {selectedTime ? format(parse(selectedTime, 'HH:mm', new Date()), "h:mm aa") : "Select time"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200">
              {availableTimes.map((time) => (
                <SelectItem 
                  key={time} 
                  value={time}
                  className="hover:bg-gray-100 cursor-pointer text-gray-900"
                >
                  {format(parse(time, 'HH:mm', new Date()), "h:mm aa")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            className="w-full bg-[#E86452] hover:bg-[#E86452]/90 text-white py-6"
            onClick={handleSchedule}
            disabled={!selectedTime}
          >
            Schedule Pickup Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};