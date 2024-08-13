import * as React from "react";
import * as Notifications from "expo-notifications";

import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Event from "@/components/event";
import Button from "@/components/button";
import Screen from "@/components/screen";
import DatePicker from "@/components/date-picker-modal";
import Swipeable from "@/components/swipeable";
import CalendarSelector from "@/components/calendar-selector";
import { ArrowLeft, ArrowRight, PlusIcon } from "@/components/icon";
import { find, isEmpty } from "lodash";

import translator from "@/utils/i18n";

import * as date from "@/utils/date";
import * as calendar from "@/utils/calendar";

import theme from "@/styles/theme";

import { CalendarType, EventType, RootStackParamList } from "@/utils/types";
import { SCREENS } from "@/utils/constants";

type HomeScreenRouteProp = RouteProp<RootStackParamList, "HOME">;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "HOME">;

type Props = {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const [calendars, setCalendars] = React.useState<CalendarType[]>([]);
  const [events, setEvents] = React.useState<EventType[]>([]);

  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [currentCalendarId, setCurrentCalendarId] = React.useState("all");
  const [defaultCalendarId, setDefaultCalendarId] = React.useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.date) {
        setCurrentDate(new Date(route.params?.date));
        setCurrentCalendarId("all");
      }
    }, [route.params?.date])
  );

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const cals = await calendar.getCalendars();
        setCalendars(cals);
      })();
    }, [])
  );

  React.useEffect(() => {
    (async () => {
      const id = await calendar.getDefaultCalendarId();
      setDefaultCalendarId(id);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const cals = await calendar.getCalendars();
      const evs = await calendar.getEvents(
        cals,
        currentDate,
        currentCalendarId
      );

      setCalendars(cals);
      setEvents(evs);
    })();
  }, [currentDate, currentCalendarId]);

  const handleEventDelete = async (id: string) => {
    await calendar.deleteEvent(id);
    const evs = await calendar.getEvents(
      calendars,
      currentDate,
      currentCalendarId
    );
    setEvents(evs);

    const notificationId = await AsyncStorage.getItem(id);
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  };

  const eventsLabel = `${events.length} ${translator.t(
    events.length === 1 ? "event" : "events"
  )}`;

  const isCalendarWritable = find(
    calendars,
    (cal) => cal.id === currentCalendarId
  )?.allowsModifications;

  return (
    <Screen>
      <DatePicker
        isVisible={isDatePickerVisible}
        setDatePickerVisibility={setDatePickerVisibility}
        onConfirm={setCurrentDate}
      />
      <Button
        onPress={() => setCurrentDate(new Date())}
        style={{
          backgroundColor: theme.BLUE,
          alignSelf: "center",
          marginBottom: 14,
          padding: 6,
          paddingHorizontal: 12,
          borderRadius: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "500" }}>
          {date.isToday(currentDate)
            ? translator.t("today")
            : translator.t("back_to_today")}
        </Text>
      </Button>

      <View
        style={{
          ...styles.horizontalSafeAreaPadding,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          style={styles.button}
          onPress={() => setCurrentDate(date.getPreviousDay(currentDate))}
        >
          <ArrowLeft size={24} color={theme.NEUTRAL[400]} />
        </Button>

        <Button
          style={{ justifyContent: "center" }}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={styles.title}>{date.getDay(currentDate)}</Text>
          <Text style={styles.date}>{`${date.getDayDigits(
            currentDate
          )} ${date.getMonth(currentDate)}`}</Text>
        </Button>

        <Button
          style={styles.button}
          onPress={() => setCurrentDate(date.getNextDay(currentDate))}
        >
          <ArrowRight size={24} color={theme.NEUTRAL[400]} />
        </Button>
      </View>

      <View
        style={{
          marginTop: 40,
          marginBottom: 20,
        }}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={{
            marginTop: 10,
            paddingLeft: 20,
          }}
        >
          <CalendarSelector
            isActive={currentCalendarId === "all"}
            onPress={() => setCurrentCalendarId("all")}
          >
            {translator.t("all")}
          </CalendarSelector>
          {calendars.map((calendar, key) => (
            <CalendarSelector
              color={calendar.color}
              isActive={currentCalendarId === calendar.id}
              key={key}
              onPress={() => setCurrentCalendarId(calendar.id)}
            >
              {calendar.title}
            </CalendarSelector>
          ))}
          <Button
            onPress={() => navigation.navigate(SCREENS.NEW_CALENDAR)}
            style={styles.createCalendarButton}
          >
            <PlusIcon size={18} color={theme.NEUTRAL[300]} />
            <Text style={styles.createCalendarButtonText}>
              {translator.t("new_calendar")}
            </Text>
          </Button>
        </ScrollView>
      </View>

      <View style={styles.eventsContainer}>
        <View style={styles.eventsContainerHeader}>
          <Text style={styles.eventsContainerHeaderLabel}>{eventsLabel}</Text>
          <Button
            onPress={() =>
              navigation.navigate(SCREENS.EVENT_DETAILS, {
                calendars,
                defaultCalendarId:
                  currentCalendarId === "all" || !isCalendarWritable
                    ? defaultCalendarId
                    : currentCalendarId,
                date: currentDate.toISOString(),
                isEmpty: true,
              })
            }
            style={styles.eventsContainerHeaderButton}
          >
            <PlusIcon size={21} color={theme.NEUTRAL[900]} />
          </Button>
        </View>
        {isEmpty(events) ? (
          <Text style={styles.eventsContainerEmptyMessage}>
            {translator.t("looks_empty")}
          </Text>
        ) : (
          <FlatList
            ItemSeparatorComponent={() => (
              <View style={styles.eventsListSeperator} />
            )}
            ListFooterComponent={() => (
              <View style={styles.eventsListSeperator} />
            )}
            showsVerticalScrollIndicator={false}
            data={events}
            renderItem={({ item: event }) => (
              <Swipeable
                onPress={() => handleEventDelete(event.id)}
                enabled={event.allowsModifications}
              >
                <Event
                  disabled={!event.allowsModifications}
                  details={event}
                  onPress={() =>
                    navigation.navigate(SCREENS.EVENT_DETAILS, {
                      event,
                      calendars,
                      date: currentDate.toISOString(),
                    })
                  }
                />
              </Swipeable>
            )}
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    color: theme.NEUTRAL[100],
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  date: {
    color: theme.NEUTRAL[300],
    fontWeight: "bold",
    fontSize: 21,
    textAlign: "center",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  createCalendarButton: {
    backgroundColor: theme.NEUTRAL[950],
    padding: 12,
    paddingRight: 16,
    borderRadius: 8,
    flexDirection: "row",
    marginRight: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.NEUTRAL[800],
  },
  createCalendarButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  eventsContainer: {
    paddingTop: 15,
    backgroundColor: theme.NEUTRAL[950],
    borderTopColor: "#1E1D1F",
    borderTopWidth: 1,
    flex: 1,
  },
  eventsContainerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.NEUTRAL[900],
  },
  eventsContainerHeaderLabel: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  eventsContainerHeaderButton: {
    backgroundColor: theme.NEUTRAL[100],
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 20,
  },
  saveDateButton: {
    backgroundColor: theme.NEUTRAL[100],
    padding: 16,
    margin: 4,
    borderRadius: 12,
  },
  saveDateButtonLabel: {
    color: theme.NEUTRAL[900],
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
  eventsContainerEmptyMessage: {
    color: theme.NEUTRAL[400],
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  eventsListSeperator: { backgroundColor: theme.NEUTRAL[900], height: 1 },
  horizontalSafeAreaPadding: {
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
