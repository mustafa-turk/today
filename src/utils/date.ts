import { capitalize } from "lodash";
import { supportedLang } from "./lang";

function addZero(number: number): string {
  return number < 10 ? `0${number}` : `${number}`;
}

export const isFutureEvent = (date: Date): boolean => {
  return date > new Date();
};

export const getNotifyDate = (date: Date, notifyBefore: number): Date => {
  const notifyDate = new Date(date.getTime() - notifyBefore * 60000);
  notifyDate.setSeconds(0, 0);
  return notifyDate;
};

export const getDay = (date: Date): string => {
  const lang = supportedLang();
  const day = new Intl.DateTimeFormat(lang || "default", {
    weekday: "long",
  }).format(date);
  return capitalize(day);
};

export const getDayDigits = (date: Date): string => {
  return date.toLocaleString("default", { day: "2-digit" });
};

export const getMonth = (date: Date): string => {
  const lang = supportedLang();
  return date.toLocaleString(lang, { month: "long" });
};

export const getStartAndEndOfDay = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  return { start, end };
};

export const getTimeFromString = (date: Date): string => {
  const parsedDate = new Date(date);
  const hours = addZero(parsedDate.getHours());
  const minutes = addZero(parsedDate.getMinutes());
  return `${hours}:${minutes}`;
};

export const timeBetweenDates = (startTime: Date, endTime: Date): number => {
  const difference =
    new Date(endTime).getTime() - new Date(startTime).getTime();
  return Math.round(difference / 60000);
};

export const getDayPlusHours = (date: Date | string, hours: number): Date => {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + hours, 0, 0, 0);
  return adjustedDate;
};

export const getNextDay = (date: Date): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
};

export const getPreviousDay = (date: Date): Date => {
  const previousDate = new Date(date);
  previousDate.setDate(previousDate.getDate() - 1);
  return previousDate;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isEventFullDay = (startTime: Date, endTime: Date): boolean => {
  const FULL_DAY_MINUTES = 1440;
  return timeBetweenDates(startTime, endTime) === FULL_DAY_MINUTES;
};
