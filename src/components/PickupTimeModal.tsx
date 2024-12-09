import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getAvailableDays, getAvailableTimeSlots } from "@/utils/businessHours";

interface PickupTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string, time: string) => void;
}

export const PickupTimeModal = ({ isOpen, onClose, onSchedule }: PickupTimeModalProps) => {
  const [step, setStep] = useState<'date' | 'time'>('date');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load available days when modal opens
  useEffect(() => {
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

    if (isOpen) {
      loadAvailableDays();
    }
  }, [isOpen]);

  // Load available time slots when date is selected
  useEffect(() => {
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
    setSelectedDate(date);
    setSelectedTime(undefined);
    if (date) {
      setStep('time');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      onSchedule(
        format(selectedDate, "EEEE, MMMM d"),
        selectedTime
      );
    }
  };

  const handleBack = () => {
    setStep('date');
  };

  const isDateUnavailable = (date: Date) => {
    return !availableDays.some(
      availableDate => 
        availableDate.getTime() === new Date(date.setHours(0,0,0,0)).getTime()
    );
  };

  if (isLoading && step === 'date') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px] bg-white p-0">
          <div className="p-6">Loading available dates...</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-white p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-[#2D3648]">
            {step === 'date' ? 'Select Date' : 'Select Time'}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {step === 'date' ? (
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={isDateUnavailable}
                className="rounded-md border"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <button
                  onClick={handleBack}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  ← Back to date selection
                </button>
              </div>
              
              <ScrollArea className="h-[300px] rounded-md border">
                <div className="grid grid-cols-3 gap-2 p-4">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={cn(
                        "w-full",
                        selectedTime === time && "bg-emerald-600 hover:bg-emerald-700"
                      )}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {format(new Date(`2000-01-01T${time}`), 'h:mm aa')}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 mt-4"
                onClick={handleSchedule}
                disabled={!selectedTime}
              >
                Schedule Pickup
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};