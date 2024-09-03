import * as Calendar from "expo-calendar";
import { first } from "lodash";
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

  async getDefaultCalendarId(): Promise<string> {
    const calendars = await this.getCalendars();
    return first(calendars).id;
  }

  filterWritableCalendars(calendars: CalendarType[]): CalendarType[] {
    return calendars.filter((calendar) => calendar.allowsModifications);
  }
}

export default new CalendarService();
