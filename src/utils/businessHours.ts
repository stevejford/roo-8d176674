import { format, addDays, isAfter, isBefore, parse, setHours, setMinutes } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

type DaySchedule = {
  open: string;
  close: string;
} | null;

export const getStoreHours = async () => {
  const { data: hours, error } = await supabase
    .from('store_hours')
    .select('*')
    .order('day_of_week');

  if (error) {
    console.error('Error fetching store hours:', error);
    return null;
  }

  return hours.reduce((acc: { [key: string]: DaySchedule }, hour) => {
    acc[hour.day_of_week] = hour.is_closed ? null : {
      open: hour.open_time,
      close: hour.close_time
    };
    return acc;
  }, {});
};

export const getAvailableDays = async (startDate: Date = new Date()): Promise<Date[]> => {
  const days: Date[] = [];
  const hours = await getStoreHours();
  
  if (!hours) return [];

  // Get next 7 days
  let currentDate = startDate;
  for (let i = 0; i < 7; i++) {
    const dayName = format(currentDate, 'EEEE');
    if (hours[dayName]) {
      days.push(currentDate);
    }
    currentDate = addDays(currentDate, 1);
  }

  return days;
};

export const getAvailableTimeSlots = async (date: Date): Promise<string[]> => {
  const dayName = format(date, 'EEEE');
  const hours = await getStoreHours();
  
  if (!hours || !hours[dayName]) return [];

  const schedule = hours[dayName];
  if (!schedule) return [];

  const timeSlots: string[] = [];
  const openTime = parse(schedule.open, 'HH:mm:ss', date);
  const closeTime = parse(schedule.close, 'HH:mm:ss', date);
  
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

export const isStoreOpen = async () => {
  const hours = await getStoreHours();
  if (!hours) return false;

  const now = new Date();
  const currentDay = format(now, 'EEEE');
  const currentTime = format(now, 'HH:mm');
  
  const schedule = hours[currentDay];
  if (!schedule) return false;

  return currentTime >= schedule.open && currentTime <= schedule.close;
};

export const getStoreSettings = async () => {
  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching store settings:', error);
    return null;
  }

  return data;
};