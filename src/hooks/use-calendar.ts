import { useEffect, useState } from "react";
import * as Calendar from "expo-calendar";

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

export const useCalendar = () => {
  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        const [defaultCalendar] = calendars;
        const { start, end } = getStartAndEndOfToday();
        const events = await Calendar.getEventsAsync(
          [defaultCalendar.id],
          start,
          end
        );
        setEvents(
          events.map((event) => ({
            color: defaultCalendar.color,
            title: event.title,
            startTime: getTimeFromString(event.startDate),
            endTime: getTimeFromString(event.endDate),
            duration: timeBetweenDates(event.startDate, event.endDate),
          }))
        );
      }
    })();
  }, []);

  return { events };
};
