import React, { useState } from "react";
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

interface PickupTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string, time: string) => void;
}

export const PickupTimeModal = ({ isOpen, onClose, onSchedule }: PickupTimeModalProps) => {
  const [step, setStep] = useState<'date' | 'time'>('date');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const timeSlots = Array.from({ length: 24 }, (_, hour) => {
    return [0, 30].map(minutes => {
      const time = new Date();
      time.setHours(hour, minutes);
      return format(time, 'h:mm aa');
    });
  }).flat();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
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
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={cn(
                        "w-full",
                        selectedTime === time && "bg-emerald-600 hover:bg-emerald-700"
                      )}
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
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