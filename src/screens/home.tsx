import * as React from "react";
import * as Calendar from "expo-calendar";

import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Event from "@/components/event";
import Button from "@/components/button";
import Screen from "@/components/screen";
import { ArrowLeft, ArrowRight, PlusIcon } from "@/components/icon";

import theme from "@/styles/theme";
import * as dateUtils from "@/utils/date";
import { flatten, find, isEmpty } from "lodash";

import { CalendarType, EventType, RootStackParamList } from "@/utils/types"

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

type Props = {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const [calendars, setCalendars] = React.useState<CalendarType[]>([]);
  const [events, setEvents] = React.useState<EventType[]>([]);

  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [currentCalendarId, setCurrentCalendarId] = React.useState('all');
  const [defaultCalendarId, setDefaultCalendarId] = React.useState("");

  const getDefaultCalendarId = async () => {
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    setDefaultCalendarId(defaultCalendar.id);
  };

  const setNextDay = async () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);

    setCurrentDate(nextDate);
  };

  const setPreviousDay = async () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);

    setCurrentDate(prevDate);
  };

  const getEvents = async () => {
    const cals = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

    const events = cals.map((cal) =>
      Calendar.getEventsAsync(
        [cal.id],
        dateUtils.getStartAndEndOfDay(currentDate).start,
        dateUtils.getStartAndEndOfDay(currentDate).end
      )
    );

    const eventsFromCalendars = await Promise.all(events);

    setEvents(
      flatten(eventsFromCalendars)
        .sort(
          (a: Calendar.Event, b: Calendar.Event) =>
            new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf()
        )
        .filter((event: Calendar.Event) => currentCalendarId === "all" || currentCalendarId === event.calendarId)
        .map((event: Calendar.Event) => ({
          id: event.id,
          calendarId: event.calendarId,
          color: find(cals, { id: event.calendarId }).color,
          title: event.title,
          startDate: event.startDate,
          endDate: event.endDate,
          duration: dateUtils.timeBetweenDates(event.startDate, event.endDate),
          startTime: dateUtils.getTimeFromString(event.startDate),
          endTime: dateUtils.getTimeFromString(event.endDate),
        }))
    );

    setCalendars(
      cals
        .filter((calendar) => calendar.allowsModifications)
        .map((calendar) => ({
          title: calendar.title,
          color: calendar.color,
          id: calendar.id,
        }))
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.date) {
        setCurrentDate(new Date(route.params?.date));
      }
    }, [route.params?.date])
  );

  React.useEffect(() => {
    (async () => {
      await getDefaultCalendarId();
    })();
  }, [])

  React.useEffect(() => {
    (async () => {
      await getEvents();
    })();
  }, [currentDate, currentCalendarId]);

  const eventsLabel = `${events.length} ${events.length === 1 ? "event" : "events"}`;

  return (
    <Screen>
      <View
        style={{
          ...styles.horizontalSafeAreaPadding,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button style={styles.button} onPress={setPreviousDay}>
          <ArrowLeft size={24} color={theme.NEUTRAL[400]} />
        </Button>

        <View style={{ justifyContent: "center" }}>
          <Text style={styles.title}>{dateUtils.getDay(currentDate)}</Text>
          <Text style={styles.date}>{`${dateUtils.getDayDigits(currentDate)} ${dateUtils.getMonth(currentDate)}`}</Text>
        </View>

        <Button style={styles.button} onPress={setNextDay}>
          <ArrowRight size={24} color={theme.NEUTRAL[400]} />
        </Button>
      </View>

      <View
        style={{
          marginTop: 40,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600", fontSize: 18, ...styles.horizontalSafeAreaPadding }}>
          Calendars
        </Text>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{
            marginTop: 10,
          }}
        >
          <Button
            onPress={() => setCurrentCalendarId('all')}
            style={{
              backgroundColor: currentCalendarId === "all" ? theme.NEUTRAL[100] : theme.NEUTRAL[800],
              padding: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              flexDirection: "row",
              marginRight: 10,
              gap: 8,
              borderWidth: 1,
              borderColor: theme.NEUTRAL[800],
              marginLeft: 20
            }}
          >
            <>
              <Text
                style={{
                  color: currentCalendarId === "all" ? theme.NEUTRAL[900] : "white",
                  fontSize: 16,
                }}
              >
                All
              </Text>
            </>
          </Button>
          {calendars.map((calendar, key) => (
            <Button
              key={key}
              onPress={() => setCurrentCalendarId(calendar.id)}
              style={{
                backgroundColor: currentCalendarId === calendar.id ? theme.NEUTRAL[100] : theme.NEUTRAL[800],
                padding: 12,
                borderRadius: 8,
                flexDirection: "row",
                marginRight: 10,
                gap: 8,
                borderWidth: 1,
                borderColor:
                  calendar.id === currentCalendarId
                    ? "#525252"
                    : theme.NEUTRAL[800],
              }}
            >
              <>
                <View
                  style={{
                    backgroundColor: calendar.color,
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                  }}
                />
                <Text
                  style={{
                    color: currentCalendarId === calendar.id ? theme.NEUTRAL[900] : "white",
                    fontSize: 16,
                  }}
                >
                  {calendar.title}
                </Text>
              </>
            </Button>
          ))}
          <Button
            onPress={() => setCurrentCalendarId('all')}
            style={{
              backgroundColor: "black",
              padding: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              flexDirection: "row",
              marginRight: 20,
              gap: 8,
              borderWidth: 1,
              borderStyle: 'dotted',
              borderColor: theme.NEUTRAL[600]
            }}
          >
            <PlusIcon size={18} color={theme.NEUTRAL[300]} />
            <Text
              style={{
                color: "white",
                fontSize: 16,
              }}
            >
              New Calendar
            </Text>
          </Button>
        </ScrollView>
      </View>

      <View style={styles.eventsContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 25,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: theme.NEUTRAL[800]
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 18 }}>
            {eventsLabel}
          </Text>
          <Button
            onPress={() =>
              navigation.navigate("EventDetails", {
                calendars,
                defaultCalendarId: currentCalendarId === "all" ? defaultCalendarId : currentCalendarId,
                date: currentDate.toISOString(),
                isEmpty: true,
              })
            }
            style={{
              backgroundColor: theme.NEUTRAL[100],
              paddingHorizontal: 24,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <PlusIcon size={21} color={theme.NEUTRAL[900]} />
          </Button>
        </View>
        {isEmpty(events) ? (
          <Text
            style={{
              color: theme.NEUTRAL[400],
              textAlign: "center",
              marginTop: 40,
              fontSize: 16,
            }}
          >
            Looks like a chill day, no events
          </Text>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.eventsList}
          >
            <View>
              {events?.map((event, index) => (
                <Event
                  details={event}
                  key={index}
                  onPress={() =>
                    navigation.navigate("EventDetails", {
                      event,
                      calendars,
                      date: currentDate.toISOString(),
                    })
                  }
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { color: theme.NEUTRAL[200], fontWeight: "bold", fontSize: 30, textAlign: "center" },
  date: { color: theme.NEUTRAL[400], fontWeight: "bold", fontSize: 21, textAlign: "center" },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18
  },
  eventsContainer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: "70%",
    backgroundColor: theme.NEUTRAL[950],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  eventsList: {
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginBottom: 30
  },
  horizontalSafeAreaPadding: {
    paddingHorizontal: 20
  }
});

export default HomeScreen;
