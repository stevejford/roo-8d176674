import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface TimeSelectorsProps {
  selectedDate: Date | undefined;
  onTimeChange: (type: "hour" | "minute" | "ampm", value: string) => void;
}

export const TimeSelectors = ({ selectedDate, onTimeChange }: TimeSelectorsProps) => {
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
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
              onClick={() => onTimeChange("hour", hour.toString())}
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
              onClick={() => onTimeChange("minute", minute.toString())}
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
              onClick={() => onTimeChange("ampm", ampm)}
            >
              {ampm}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};