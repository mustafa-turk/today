import * as Calendar from "expo-calendar";
import * as date from "@/utils/date";
import { find, flatten } from "lodash";
import { CalendarType } from "@/utils/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as dateUtils from "@/utils/date";
import { EventType } from "@/utils/types";

class EventsService {
  async createOrUpdateEvent(
    updatedEvent: Partial<EventType>,
    isEmpty: boolean
  ): Promise<string> {
    let eventId: string;

    if (isEmpty) {
      eventId = await Calendar.createEventAsync(updatedEvent.calendarId, {
        title: updatedEvent.title,
        startDate: updatedEvent.startDate,
        endDate: updatedEvent.endDate,
        notes: updatedEvent.notes,
        location: updatedEvent.location,
      });
    } else {
      eventId = await Calendar.updateEventAsync(updatedEvent.id, {
        title: updatedEvent.title,
        startDate: updatedEvent.startDate,
        endDate: updatedEvent.endDate,
        calendarId: updatedEvent.calendarId,
        notes: updatedEvent.notes,
        location: updatedEvent.location,
      });
    }

    return eventId;
  }

  async scheduleNotification(
    eventId: string,
    title: string,
    startDate: Date,
    shouldNotifyBefore: boolean
  ) {
    if (shouldNotifyBefore) {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          sound: "default",
        },
        trigger: dateUtils.getNotifyDate(startDate, 1),
      });

      await AsyncStorage.setItem(eventId, notificationId);
    } else {
      await AsyncStorage.removeItem(eventId);
    }
  }

  async getNotificationStatus(eventId: string): Promise<boolean> {
    const notificationId = await AsyncStorage.getItem(eventId);
    return Boolean(notificationId);
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
}

export default new EventsService();
