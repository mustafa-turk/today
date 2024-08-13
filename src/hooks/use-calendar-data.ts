import { useState, useEffect, useCallback } from "react";
import * as Notifications from "expo-notifications";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CalendarService from "@/services/calendar-service";

import { CalendarType, EventType } from "@/utils/types";

export const useCalendarData = (
  currentDate: Date,
  currentCalendarId: string
) => {
  const [calendars, setCalendars] = useState<CalendarType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [defaultCalendarId, setDefaultCalendarId] = useState("");

  useFocusEffect(
    useCallback(() => {
      const fetchCalendars = async () => {
        const cals = await CalendarService.getCalendars();
        setCalendars(cals);
      };

      fetchCalendars();
    }, [])
  );

  useEffect(() => {
    const fetchDefaultCalendarId = async () => {
      const id = await CalendarService.getDefaultCalendarId();
      setDefaultCalendarId(id);
    };

    fetchDefaultCalendarId();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [currentDate, currentCalendarId]);

  const fetchEvents = async (calendarsList = calendars) => {
    const evs = await CalendarService.getEvents(
      calendarsList,
      currentDate,
      currentCalendarId
    );
    setEvents(evs);
  };

  const deleteEvent = async (id: string) => {
    await CalendarService.deleteEvent(id);
    await fetchEvents();

    const notificationId = await AsyncStorage.getItem(id);
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  };

  return {
    calendars,
    events,
    defaultCalendarId,
    refetchEvents: fetchEvents,
    deleteEvent,
  };
};
