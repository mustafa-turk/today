import { useEffect, useState } from "react";
import * as Calendar from "expo-calendar";
import { flatten, find } from "lodash";

import {
  getStartAndEndOfToday,
  timeBetweenDates,
  getTimeFromString,
} from "@/utils/date";

type Event = {
  color: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
};

type Calendar = {
  color: string;
  title: string;
  id: string;
};

export const useCalendar = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );

        const events = calendars.map((calendar) =>
          Calendar.getEventsAsync(
            [calendar.id],
            getStartAndEndOfToday().start,
            getStartAndEndOfToday().end
          )
        );

        const allEvents = await Promise.all(events);

        setEvents(
          flatten(allEvents)
            .sort(
              (a: Calendar.Event, b: Calendar.Event) =>
                new Date(a.startDate) - new Date(b.startDate)
            )
            .map((event: Calendar.Event) => ({
              color: find(calendars, { id: event.calendarId }).color,
              title: event.title,
              startTime: getTimeFromString(event.startDate),
              endTime: getTimeFromString(event.endDate),
              startDate: event.startDate,
              endDate: event.endDate,
              duration: timeBetweenDates(event.startDate, event.endDate),
            }))
        );
        setCalendars(
          calendars.map((calendar) => ({
            title: calendar.title,
            color: calendar.color,
            id: calendar.id,
          }))
        );
      }
    })();
  }, []);

  return { events, calendars };
};
