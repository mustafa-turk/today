import { capitalize } from "lodash";
import { supportedLang } from "./lang";

export const isFutureEvent = (date: Date) => {
  return new Date(date) > new Date();
};

export const getNotifyDate = (date: Date, notifyBefore: number) => {
  const notifyDate = new Date(date.getTime() - notifyBefore * 60000);
  notifyDate.setSeconds(0);

  return notifyDate;
};

export const getDay = (date: Date) => {
  const lang = supportedLang();
  const day = new Intl.DateTimeFormat(lang || "default", {
    weekday: "long",
  }).format(date);

  return capitalize(day);
};

export const getDayDigits = (date: Date) => {
  const day = date.toLocaleString("default", { day: "2-digit" });
  return day;
};

export const getMonth = (date: Date) => {
  const lang = supportedLang();
  const month = date.toLocaleString(lang, { month: "long" });
  return month;
};

export const getStartAndEndOfDay = (date: Date) => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
};

export const getTimeFromString = (date: string | Date) => {
  const hours = addZero(new Date(date).getHours());
  const minutes = addZero(new Date(date).getMinutes());

  return `${hours}:${minutes}`;
};

export const timeBetweenDates = (
  startTime: string | Date,
  endTime: string | Date
) => {
  const difference =
    new Date(endTime).getTime() - new Date(startTime).getTime();

  return Math.round(difference / 60000);
};

export const getDayPlusHours = (date: Date | string, hours: number) => {
  const today = new Date(date);
  today.setHours(today.getHours() + hours);
  today.setMinutes(0);
  return today;
};

function addZero(number: number): string | number {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

export const getNextDay = (date: Date) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  return nextDate;
};

export const getPreviousDay = (date: Date) => {
  const previousDay = new Date(date);
  previousDay.setDate(previousDay.getDate() - 1);

  return previousDay;
};

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
  );
};

export const isEventFullDay = (
  startTime: string | Date,
  endTime: string | Date
) => {
  const FULL_DAY_MINUTES = 1440;

  const minutesBetweenTimes = timeBetweenDates(startTime, endTime);
  const isEventFullDay = minutesBetweenTimes === FULL_DAY_MINUTES;

  return isEventFullDay;
};
