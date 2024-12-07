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

  useEffect(() => {
    setAvailableDays(getAvailableDays());
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const times = getAvailableTimeSlots(selectedDate);
      setAvailableTimes(times);
      setSelectedTime(times[0] || "");
    }
  }, [selectedDate]);

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      onSchedule(
        format(selectedDate, "EEEE, MMMM d"),
        format(parse(selectedTime, 'HH:mm', new Date()), "h:mm aa")
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
            <SelectTrigger className="w-full">
              <SelectValue>
                {format(selectedDate, "EEEE, MMMM d")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableDays.map((day) => (
                <SelectItem key={day.toISOString()} value={day.toISOString()}>
                  {format(day, "EEEE, MMMM d")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedTime}
            onValueChange={setSelectedTime}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {selectedTime ? format(parse(selectedTime, 'HH:mm', new Date()), "h:mm aa") : "Select time"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableTimes.map((time) => (
                <SelectItem key={time} value={time}>
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