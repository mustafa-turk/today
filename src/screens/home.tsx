import * as React from "react";
import {
  ScrollView, StyleSheet, Text, TouchableHighlight, View
} from "react-native";
import * as Calendar from "expo-calendar";

import Event from "@/components/event";
import { ArrowLeft, ArrowRight, PlusIcon } from "@/components/icon";

import theme from "@/styles/theme";
import { getDay, getDayDigits, getMonth } from "@/utils/date";

import { flatten, find } from "lodash";

import {
  getStartAndEndOfDay,
  timeBetweenDates,
  getTimeFromString,
} from "@/utils/date";
import { useFocusEffect } from "@react-navigation/native";

type Calendar = {
  color: string;
  title: string;
  id: string;
};

type Event = {
  color: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
};

const HomeScreen = ({ navigation, route }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [defaultCalendarId, setDefaultCalendarId] = React.useState("");
  const [calendars, setCalendars] = React.useState<Calendar[]>([]);
  const [events, setEvents] = React.useState<Event[]>([]);

  const getDefaultCalendarId = async () => {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    setDefaultCalendarId(defaultCalendar.id);
  }

  const setNextDay = async () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    setCurrentDate(nextDate);
  }

  const setPreviousDay = async () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);

    setCurrentDate(prevDate);
  }

  const getEvents = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status === "granted") {
      const cals = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

      const events = cals.map((cal) =>
        Calendar.getEventsAsync(
          [cal.id],
          getStartAndEndOfDay(currentDate).start,
          getStartAndEndOfDay(currentDate).end
        )
      );

      const eventsFromCalendars = await Promise.all(events);

      setEvents(
        flatten(eventsFromCalendars)
          .sort(
            (a: Calendar.Event, b: Calendar.Event) =>
              new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf()
          )
          .map((event: Calendar.Event) => ({
            id: event.id,
            calendarId: event.calendarId,
            color: find(cals, { id: event.calendarId }).color,
            title: event.title,
            startDate: event.startDate,
            endDate: event.endDate,
            duration: timeBetweenDates(event.startDate, event.endDate),
            startTime: getTimeFromString(event.startDate),
            endTime: getTimeFromString(event.endDate),
          }))
      );

      setCalendars(
        cals.map((calendar) => ({
          title: calendar.title,
          color: calendar.color,
          id: calendar.id,
        }))
      );
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.date) {
        setCurrentDate(new Date(route.params?.date))
      }
    }, [route.params?.date])
  );

  React.useEffect(() => {
    (async () => {
      await getDefaultCalendarId();
      await getEvents();
    })();
  }, [currentDate]);

  const eventsLabel = `${events.length} ${events.length === 1 ? "event" : "events"}`;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.title}>{getDay(currentDate)}, </Text>
        <Text style={styles.date}>{`${getMonth(currentDate)} ${getDayDigits(currentDate)}`}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <TouchableHighlight
          activeOpacity={0.7}
          style={styles.button}
          onPress={setPreviousDay}
        >
          <Text style={styles.buttonIcon}>
            <ArrowLeft size={24} />
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          activeOpacity={0.7}
          style={styles.button}
          onPress={setNextDay}
        >
          <Text style={styles.buttonIcon}>
            <ArrowRight size={24} />
          </Text>
        </TouchableHighlight>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 40 }}>
        <Text style={{ color: "white", fontWeight: 600, fontSize: 18 }}>
          {eventsLabel}
        </Text>
        <TouchableHighlight
          onPress={() => navigation.navigate("EventDetails", { defaultCalendarId, date: currentDate.toISOString(), calendars, isEmpty: true })}
          style={{ backgroundColor: theme.NEUTRAL[900], paddingHorizontal: 24, paddingVertical: 6, borderRadius: 20 }}>
          <PlusIcon size={21} color={theme.NEUTRAL[400]} />
        </TouchableHighlight>
      </View>

      <View style={styles.eventsContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.eventsList}
        >
          <View>
            {events?.map((event, key) => (
              <Event
                details={event}
                key={key}
                onPress={() => navigation.navigate("EventDetails", { event, calendars, date: currentDate.toISOString() })}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: { color: "#d4d4d4", fontWeight: "bold", fontSize: 32 },
  date: { color: "#737373", fontWeight: "bold", fontSize: 32 },
  button: {
    backgroundColor: "#171717",
    borderRadius: 20,
    marginTop: 20,
    flex: 1,
  },
  buttonIcon: {
    color: "#525252",
    textAlign: "center",
    padding: 20,
    fontSize: 30,
  },
  eventsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: "72%",
    backgroundColor: theme.NEUTRAL[900],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  eventsList: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
});

export default HomeScreen;
