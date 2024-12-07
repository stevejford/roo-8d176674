import { format, addDays, isAfter, isBefore, parse, setHours, setMinutes } from "date-fns";

type DaySchedule = {
  open: string;
  close: string;
} | null;

export const businessHours: { [key: string]: DaySchedule } = {
  Sunday: { open: '11:00', close: '20:30' },
  Monday: null,
  Tuesday: { open: '16:00', close: '20:30' },
  Wednesday: { open: '16:00', close: '20:30' },
  Thursday: { open: '16:00', close: '20:30' },
  Friday: { open: '11:00', close: '20:30' },
  Saturday: { open: '11:00', close: '20:30' },
};

export const getAvailableDays = (startDate: Date = new Date()): Date[] => {
  const days: Date[] = [];
  let currentDate = startDate;

  // Get next 7 days
  for (let i = 0; i < 7; i++) {
    const dayName = format(currentDate, 'EEEE');
    if (businessHours[dayName]) {
      days.push(currentDate);
    }
    currentDate = addDays(currentDate, 1);
  }

  return days;
};

export const getAvailableTimeSlots = (date: Date): string[] => {
  const dayName = format(date, 'EEEE');
  const schedule = businessHours[dayName];
  
  if (!schedule) return [];

  const timeSlots: string[] = [];
  const openTime = parse(schedule.open, 'HH:mm', date);
  const closeTime = parse(schedule.close, 'HH:mm', date);
  
  let currentTime = openTime;
  const now = new Date();
  
  // Generate 15-minute intervals
  while (isBefore(currentTime, closeTime)) {
    // If it's today, only show future times
    if (!isAfter(date, now) || isAfter(currentTime, now)) {
      timeSlots.push(format(currentTime, 'HH:mm'));
    }
    currentTime = setMinutes(currentTime, getMinutes(currentTime) + 15);
  }

  return timeSlots;
};

const getMinutes = (date: Date): number => {
  return date.getMinutes();
};