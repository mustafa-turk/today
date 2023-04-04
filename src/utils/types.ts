export type RootStackParamList = {
  Home: { date: Date } | undefined,
  GrantAccess: undefined,
  EventDetails: { defaultCalendarId: string, event: EventType, date: Date, calendars: CalendarType[], isEmpty: boolean },
  NewCalendar: undefined
};

export type CalendarType = {
  color: string;
  title: string;
  id: string;
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
};