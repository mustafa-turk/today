export type RootStackParamList = {
  Home: { date: Date | string } | undefined;
  GrantAccess: undefined;
  EventDetails: {
    defaultCalendarId?: string;
    event?: EventType;
    date: string;
    calendars: CalendarType[];
    isEmpty?: boolean;
  };
  NewCalendar: undefined;
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
};
