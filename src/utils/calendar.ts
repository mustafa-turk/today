import * as Calendar from "expo-calendar";
import * as date from "@/utils/date";
import { find, flatten } from "lodash";
import { CalendarType } from "./types";

export const getCalendars = async () => {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );
  return calendars.map((calendar) => ({
    allowsModifications: calendar.allowsModifications,
    title: calendar.title,
    color: calendar.color,
    id: calendar.id,
  }));
};

export const getEvents = async (
  cals: CalendarType[],
  currentDate: Date,
  currentCalendarId: string
) => {
  const events = cals.map((cal) =>
    Calendar.getEventsAsync(
      [cal.id],
      date.getStartAndEndOfDay(currentDate).start,
      date.getStartAndEndOfDay(currentDate).end
    )
  );

  const eventsPromise = await Promise.all(events);

  return flatten(eventsPromise)
    .sort(
      (a: Calendar.Event, b: Calendar.Event) =>
        new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf()
    )
    .filter(
      (event: Calendar.Event) =>
        currentCalendarId === "all" || currentCalendarId === event.calendarId
    )
    .map((event: Calendar.Event) => ({
      id: event.id,
      notes: event.notes,
      calendarId: event.calendarId,
      allowsModifications: find(cals, { id: event.calendarId })
        .allowsModifications,
      calendarTitle: find(cals, { id: event.calendarId }).title,
      color: find(cals, { id: event.calendarId }).color,
      title: event.title,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      duration: date.timeBetweenDates(event.startDate, event.endDate),
      startTime: date.getTimeFromString(event.startDate),
      endTime: date.getTimeFromString(event.endDate),
    }));
};

export const deleteEvent = async (id: string) => {
  await Calendar.deleteEventAsync(id);
};

export const getDefaultCalendarId = async () => {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.id;
};

export const filterWritableCalendars = (calendars: CalendarType[]) => {
  return calendars.filter((calendar) => calendar.allowsModifications);
};
