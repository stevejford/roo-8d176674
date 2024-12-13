import { format, addDays, isAfter, isBefore, parse, setMinutes, startOfDay, endOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

type StoreHours = {
  day_of_week: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
}

type DaySchedule = {
  open: string | null;
  close: string | null;
  is_closed: boolean;
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

  return hours.reduce((acc: { [key: string]: DaySchedule }, hour: StoreHours) => {
    acc[hour.day_of_week] = hour.is_closed ? null : {
      open: hour.open_time,
      close: hour.close_time,
      is_closed: hour.is_closed
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
    // Check if the day is not marked as closed in store hours
    if (hours[dayName] && !hours[dayName]?.is_closed) {
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
  if (!schedule || !schedule.open || !schedule.close) return [];

  const timeSlots: string[] = [];
  const [openHour, openMinute] = schedule.open.split(':').map(Number);
  const [closeHour, closeMinute] = schedule.close.split(':').map(Number);
  
  let currentTime = new Date(date);
  currentTime.setHours(openHour, openMinute, 0);
  
  const closeTime = new Date(date);
  closeTime.setHours(closeHour, closeMinute, 0);
  
  const now = new Date();
  const isToday = startOfDay(date).getTime() === startOfDay(now).getTime();
  
  // Generate 15-minute intervals
  while (isBefore(currentTime, closeTime)) {
    // For today, only show future times if store is open
    // For future dates, show all times within business hours
    if (!isToday || isAfter(currentTime, now)) {
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
  const currentDay = format(now, 'EEEE');
  const currentTime = format(now, 'HH:mm');
  
  console.log('Current time check:', {
    now,
    currentDay,
    currentTime
  });

  // Get today's schedule
  const todaySchedule = hours[currentDay];
  if (!todaySchedule || !todaySchedule.open || !todaySchedule.close) {
    console.log('Store is closed today');
    return false;
  }

  console.log('Today\'s schedule:', todaySchedule);

  // Parse store hours
  const openTime = parse(todaySchedule.open, 'HH:mm', new Date());
  const closeTime = parse(todaySchedule.close, 'HH:mm', new Date());
  const currentTimeDate = parse(currentTime, 'HH:mm', new Date());

  // Check if current time is within business hours
  const isWithinHours = isAfter(currentTimeDate, openTime) && isBefore(currentTimeDate, closeTime);
  
  console.log('Hours check:', {
    currentTime,
    openTime: format(openTime, 'HH:mm'),
    closeTime: format(closeTime, 'HH:mm'),
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