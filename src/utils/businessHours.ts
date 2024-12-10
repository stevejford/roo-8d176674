import { format, addDays, isAfter, isBefore, parse, setMinutes, startOfDay, endOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

type DaySchedule = {
  open: string;
  close: string;
} | null;

const dayOrder = {
  'Sunday': 0,
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6
};

export const getStoreHours = async () => {
  const { data: hours, error } = await supabase
    .from('store_hours')
    .select('*');

  if (error) {
    console.error('Error fetching store hours:', error);
    return null;
  }

  hours.sort((a, b) => 
    dayOrder[a.day_of_week as keyof typeof dayOrder] - 
    dayOrder[b.day_of_week as keyof typeof dayOrder]
  );

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
  let currentDate = startOfDay(startDate);
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
  const [openHour, openMinute] = schedule.open.split(':').map(Number);
  const [closeHour, closeMinute] = schedule.close.split(':').map(Number);
  
  let currentTime = new Date(date);
  currentTime.setHours(openHour, openMinute, 0);
  
  const closeTime = new Date(date);
  closeTime.setHours(closeHour, closeMinute, 0);
  
  const now = new Date();
  
  // Generate 15-minute intervals
  while (isBefore(currentTime, closeTime)) {
    // If it's today, only show future times
    if (isBefore(startOfDay(date), startOfDay(now)) || isAfter(currentTime, now)) {
      timeSlots.push(format(currentTime, 'HH:mm'));
    }
    currentTime = setMinutes(currentTime, currentTime.getMinutes() + 15);
  }

  return timeSlots;
};

export const isStoreOpen = async () => {
  const hours = await getStoreHours();
  if (!hours) return false;

  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = format(now, 'EEEE');
  const currentTime = format(now, 'HH:mm');
  
  console.log('Current time check:', {
    now,
    currentHour,
    currentDay,
    currentTime
  });

  // Get today's schedule
  const todaySchedule = hours[currentDay];
  if (!todaySchedule) {
    console.log('No schedule found for today');
    return false;
  }

  console.log('Today\'s schedule:', todaySchedule);

  // If it's after midnight and before store opening time, allow pre-orders
  if (currentHour >= 0) {
    const [openHour, openMinute] = todaySchedule.open.split(':').map(Number);
    const openingTime = new Date(now);
    openingTime.setHours(openHour, openMinute, 0);
    
    console.log('Pre-order time check:', {
      currentHour,
      openingTime,
      isBeforeOpening: isBefore(now, openingTime)
    });
    
    if (isBefore(now, openingTime)) {
      console.log('Pre-orders allowed: It\'s after midnight and before opening time');
      return true;
    }
  }

  // During regular hours, check if we're within opening hours
  const isWithinHours = currentTime >= todaySchedule.open && currentTime <= todaySchedule.close;
  console.log('Regular hours check:', {
    currentTime,
    openTime: todaySchedule.open,
    closeTime: todaySchedule.close,
    isWithinHours
  });

  return isWithinHours;
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
