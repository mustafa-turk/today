import * as React from "react";

import { isEmpty } from "lodash";

import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

import Event from "@/components/event";
import Button from "@/components/button";
import Screen from "@/components/screen";
import DatePicker from "@/components/date-picker-modal";
import Swipeable from "@/components/swipeable";
import CalendarSelector from "@/components/calendar-selector";
import { ArrowLeft, ArrowRight, PlusIcon } from "@/components/icon";

import translator from "@/utils/i18n";

import * as date from "@/utils/date";

import theme from "@/styles/theme";

import { RootStackParamList } from "@/utils/types";
import { SCREENS } from "@/utils/constants";
import { useCalendarData } from "@/hooks/use-calendar-data";

type HomeScreenRouteProp = RouteProp<RootStackParamList, "HOME">;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "HOME">;

type Props = {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [currentCalendarId, setCurrentCalendarId] = React.useState("all");
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const { calendars, events, defaultCalendarId, refetchEvents, deleteEvent } =
    useCalendarData(currentDate, currentCalendarId);

  const CalendarService = useFocusEffect(
    React.useCallback(() => {
      if (route.params?.date) {
        setCurrentDate(new Date(route.params?.date));
        setCurrentCalendarId("all");
      }
    }, [route.params?.date])
  );

  const eventsLabel = `${events.length} ${translator.t(
    events.length === 1 ? "event" : "events"
  )}`;

  const isCalendarWritable = calendars.find(
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
        style={styles.todayButton}
      >
        <Text style={styles.todayButtonText}>
          {date.isToday(currentDate)
            ? translator.t("today")
            : translator.t("back_to_today")}
        </Text>
      </Button>

      <View style={styles.headerContainer}>
        <Button
          style={styles.button}
          onPress={() => setCurrentDate(date.getPreviousDay(currentDate))}
        >
          <ArrowLeft size={24} color={theme.NEUTRAL[400]} />
        </Button>

        <Button
          style={styles.dateButton}
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

      <View style={styles.calendarContainer}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={styles.calendarScroll}
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
                onPress={() => deleteEvent(event.id)}
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
  todayButton: {
    backgroundColor: theme.BLUE,
    alignSelf: "center",
    marginBottom: 14,
    padding: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  todayButtonText: {
    color: "white",
    fontWeight: "500",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  dateButton: {
    justifyContent: "center",
  },
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
  calendarContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  calendarScroll: {
    marginTop: 10,
    paddingLeft: 20,
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
  eventsContainerEmptyMessage: {
    color: theme.NEUTRAL[400],
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
  eventsListSeperator: {
    backgroundColor: theme.NEUTRAL[900],
    height: 1,
  },
  horizontalSafeAreaPadding: {
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
