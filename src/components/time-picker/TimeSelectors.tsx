import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimeSelectorsProps {
  selectedDate: Date | undefined;
  onTimeChange: (type: "hour" | "minute" | "ampm", value: string) => void;
}

export const TimeSelectors = ({ selectedDate, onTimeChange }: TimeSelectorsProps) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const ampm = ["AM", "PM"];

  const getSelectedHour = () => {
    if (!selectedDate) return null;
    let hour = selectedDate.getHours() % 12;
    return hour === 0 ? 12 : hour;
  };

  const getSelectedMinute = () => {
    if (!selectedDate) return null;
    return selectedDate.getMinutes();
  };

  const getSelectedAMPM = () => {
    if (!selectedDate) return null;
    return selectedDate.getHours() >= 12 ? "PM" : "AM";
  };

  return (
    <div className="flex flex-col sm:h-[300px] border-t sm:border-t-0 sm:border-l border-gray-200">
      <div className="grid grid-cols-3 gap-2 p-3">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2">Hour</span>
          <ScrollArea className="h-[220px] w-full rounded-md">
            <div className="flex flex-col gap-1">
              {hours.map((hour) => (
                <Button
                  key={hour}
                  variant={getSelectedHour() === hour ? "default" : "ghost"}
                  className="w-full"
                  onClick={() => onTimeChange("hour", hour.toString())}
                >
                  {hour}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2">Min</span>
          <ScrollArea className="h-[220px] w-full rounded-md">
            <div className="flex flex-col gap-1">
              {minutes.map((minute) => (
                <Button
                  key={minute}
                  variant={getSelectedMinute() === minute ? "default" : "ghost"}
                  className="w-full"
                  onClick={() => onTimeChange("minute", minute.toString())}
                >
                  {minute.toString().padStart(2, '0')}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-500 mb-2">AM/PM</span>
          <div className="flex flex-col gap-1">
            {ampm.map((period) => (
              <Button
                key={period}
                variant={getSelectedAMPM() === period ? "default" : "ghost"}
                className="w-full"
                onClick={() => onTimeChange("ampm", period)}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};