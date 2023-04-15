import { SCREENS } from "./constants";

export type RootStackParamList = {
  [SCREENS.HOME]: { date: Date | string } | undefined;
  [SCREENS.GRANT_ACCESS]: undefined;
  [SCREENS.EVENT_DETAILS]: {
    defaultCalendarId?: string;
    event?: EventType;
    date: string;
    calendars: CalendarType[];
    isEmpty?: boolean;
  };
  [SCREENS.NEW_CALENDAR]: undefined;
  [SCREENS.GET_STARTED]: undefined;
};

export type CalendarType = {
  color: string;
  title: string;
  id: string;
  allowsModifications: boolean;
};

export type EventType = {
  id: string;
  color: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  calendarId: string;
  startDate: Date | string;
  endDate: Date | string;
  notes: string;
  location: string;
  allowsModifications: boolean;
  calendarTitle: string;
  isEventAllDay: boolean;
};
