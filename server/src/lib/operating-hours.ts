import { DayOfWeek } from '../types/enums';

export interface ScheduleItem {
  dayOfWeek: string;
  openTime: string; // "HH:MM"
  closeTime: string; // "HH:MM"
  isClosed: boolean;
}

export interface OperatingHoursEvaluation {
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isOpenNow: boolean;
  statusText?: string;
  nextOpeningTime?: string;
}

const DAYS_ORDER: string[] = [
  DayOfWeek.SUNDAY,
  DayOfWeek.MONDAY,
  DayOfWeek.TUESDAY,
  DayOfWeek.WEDNESDAY,
  DayOfWeek.THURSDAY,
  DayOfWeek.FRIDAY,
  DayOfWeek.SATURDAY,
];

/**
 * Extract the current day of the week, hour, and minute strictly in Asia/Kolkata (IST).
 * Serverless runtimes (like Vercel) execute in UTC by default. This function guarantees
 * accurate Indian Standard Time without host environment dependencies.
 */
export function getKolkataTime(date: Date = new Date()): {
  dayOfWeek: string;
  hours: number;
  minutes: number;
  currentMinutes: number;
} {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  });

  const parts = formatter.formatToParts(date);
  let weekday = '';
  let hour = 0;
  let minute = 0;

  for (const part of parts) {
    if (part.type === 'weekday') weekday = part.value.toUpperCase();
    if (part.type === 'hour') hour = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
  }

  return {
    dayOfWeek: weekday,
    hours: hour,
    minutes: minute,
    currentMinutes: hour * 60 + minute,
  };
}

export function getPreviousDay(day: string): string {
  const idx = DAYS_ORDER.indexOf(day);
  if (idx === -1) return DayOfWeek.SUNDAY;
  return DAYS_ORDER[(idx - 1 + 7) % 7];
}

export function getNextDay(day: string): string {
  const idx = DAYS_ORDER.indexOf(day);
  if (idx === -1) return DayOfWeek.MONDAY;
  return DAYS_ORDER[(idx + 1) % 7];
}

/**
 * Evaluates whether a vendor is currently open in Asia/Kolkata (IST).
 * Accurately handles:
 * 1. Standard daytime shifts (e.g. 10:00 to 22:00)
 * 2. Late-night shifts crossing midnight (e.g. Sarafa night bazaar 18:00 to 01:30)
 * 3. Shifts from the PREVIOUS day that extend past midnight into today morning
 * 4. Closed days and upcoming opening times
 */
export function evaluateOperatingHours(
  operatingHours: ScheduleItem[],
  referenceDate: Date = new Date()
): OperatingHoursEvaluation | null {
  if (!operatingHours || operatingHours.length === 0) return null;

  const { dayOfWeek: currentDay, currentMinutes } = getKolkataTime(referenceDate);

  // 1. First, check if an overnight shift that started YESTERDAY is still active this morning
  const yesterday = getPreviousDay(currentDay);
  const yesterdaySchedule = operatingHours.find((h) => h.dayOfWeek === yesterday);

  if (yesterdaySchedule && !yesterdaySchedule.isClosed && yesterdaySchedule.openTime && yesterdaySchedule.closeTime) {
    const [yOpenH, yOpenM] = yesterdaySchedule.openTime.split(':').map(Number);
    const [yCloseH, yCloseM] = yesterdaySchedule.closeTime.split(':').map(Number);
    const yOpenMinutes = yOpenH * 60 + yOpenM;
    const yCloseMinutes = yCloseH * 60 + yCloseM;

    // Overnight shift: closeMinutes < openMinutes (e.g. 18:00 to 01:30 -> 90 < 1080)
    if (yCloseMinutes < yOpenMinutes && currentMinutes <= yCloseMinutes) {
      return {
        dayOfWeek: yesterdaySchedule.dayOfWeek,
        openTime: yesterdaySchedule.openTime,
        closeTime: yesterdaySchedule.closeTime,
        isClosed: false,
        isOpenNow: true,
        statusText: `Open Now • Closes at ${yesterdaySchedule.closeTime}`,
      };
    }
  }

  // 2. Second, evaluate TODAY's schedule
  const todaySchedule = operatingHours.find((h) => h.dayOfWeek === currentDay);

  if (!todaySchedule) {
    return null;
  }

  if (todaySchedule.isClosed) {
    // Find next opening day
    let nextOpeningTime: string | undefined;
    let checkDay = getNextDay(currentDay);
    for (let i = 0; i < 6; i++) {
      const nextSched = operatingHours.find((h) => h.dayOfWeek === checkDay);
      if (nextSched && !nextSched.isClosed) {
        nextOpeningTime = `${checkDay} ${nextSched.openTime}`;
        break;
      }
      checkDay = getNextDay(checkDay);
    }

    return {
      dayOfWeek: todaySchedule.dayOfWeek,
      openTime: todaySchedule.openTime || '00:00',
      closeTime: todaySchedule.closeTime || '00:00',
      isClosed: true,
      isOpenNow: false,
      statusText: nextOpeningTime ? `Closed Today • Opens ${nextOpeningTime}` : 'Closed Today',
      nextOpeningTime,
    };
  }

  const [openH, openM] = todaySchedule.openTime.split(':').map(Number);
  const [closeH, closeM] = todaySchedule.closeTime.split(':').map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  let isOpen = false;

  if (closeMinutes < openMinutes) {
    // Overnight shift that begins today: active if current time is >= openTime
    isOpen = currentMinutes >= openMinutes;
  } else {
    // Standard daytime shift
    isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  }

  let statusText = '';
  if (isOpen) {
    statusText = `Open Now • Closes at ${todaySchedule.closeTime}`;
  } else if (currentMinutes < openMinutes) {
    statusText = `Closed • Opens today at ${todaySchedule.openTime}`;
  } else {
    statusText = `Closed • Closed at ${todaySchedule.closeTime}`;
  }

  return {
    dayOfWeek: todaySchedule.dayOfWeek,
    openTime: todaySchedule.openTime,
    closeTime: todaySchedule.closeTime,
    isClosed: false,
    isOpenNow: isOpen,
    statusText,
  };
}
