import * as Calendar from "expo-calendar";
import * as date from "@/utils/date";
import { find, first, flatten } from "lodash";
import { CalendarType } from "@/utils/types";

class CalendarService {
  isCalendarNameValid(name: string): boolean {
    const regex = /^[a-zA-ZÀ-ÿ-. ]*$/;
    return regex.test(name);
  }

  async getCalendars(): Promise<CalendarType[]> {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    return calendars
      .filter((calendar) => calendar.title !== "Birthdays")
      .filter((calendar) => this.isCalendarNameValid(calendar.title))
      .sort((calendarA, calendarB) =>
        calendarA.title.localeCompare(calendarB.title)
      )
      .map((calendar) => ({
        allowsModifications: calendar.allowsModifications,
        title: calendar.title,
        color: calendar.color,
        id: calendar.id,
      }));
  }

  async getEvents(
    cals: CalendarType[],
    currentDate: Date,
    currentCalendarId: string
  ): Promise<any[]> {
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
        fullDay: date.timeBetweenDates(event.startDate, event.endDate),
        isEventAllDay: date.isEventFullDay(event.startDate, event.endDate),
      }));
  }

  async deleteEvent(id: string): Promise<void> {
    await Calendar.deleteEventAsync(id);
  }

  async getDefaultCalendarId(): Promise<string> {
    const calendars = await this.getCalendars();
    return first(calendars).id;
  }

  filterWritableCalendars(calendars: CalendarType[]): CalendarType[] {
    return calendars.filter((calendar) => calendar.allowsModifications);
  }
}

export default new CalendarService();
