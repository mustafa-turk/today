import * as React from "react";

import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import Event from "@/components/event";
import Button from "@/components/button";
import Screen from "@/components/screen";
import Swipeable from "@/components/swipeable";
import { ArrowLeft, ArrowRight, PlusIcon } from "@/components/icon";
import { find, isEmpty } from "lodash";

import translator from "@/utils/i18n";

import * as date from "@/utils/date";
import * as calendar from "@/utils/calendar";

import theme from "@/styles/theme";

import { CalendarType, EventType, RootStackParamList } from "@/utils/types";
import { SCREENS } from "@/utils/constants";
import { supportedLang } from "@/utils/lang";

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

  const lang = supportedLang();

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
  };

  const eventsLabel = `${events.length} ${
    events.length === 1 ? translator.t("event") : translator.t("events")
  }`;

  const isCalendarWritable = find(
    calendars,
    (cal) => cal.id === currentCalendarId
  )?.allowsModifications;

  return (
    <Screen>
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
          }}
        >
          <Button
            onPress={() => setCurrentCalendarId("all")}
            style={{
              ...styles.allButton,
              backgroundColor:
                currentCalendarId === "all"
                  ? theme.NEUTRAL[100]
                  : theme.NEUTRAL[950],
            }}
          >
            <>
              <Text
                style={{
                  color: currentCalendarId === "all" ? "#212224" : "white",
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                {translator.t("all")}
              </Text>
            </>
          </Button>
          {calendars.map((calendar, key) => (
            <Button
              key={key}
              onPress={() => setCurrentCalendarId(calendar.id)}
              style={{
                ...styles.calenderButton,
                backgroundColor:
                  currentCalendarId === calendar.id
                    ? theme.NEUTRAL[100]
                    : theme.NEUTRAL[950],
              }}
            >
              <View
                style={{
                  ...styles.calenderIcon,
                  backgroundColor: calendar.color,
                }}
              />
              <Text
                style={{
                  color:
                    currentCalendarId === calendar.id ? "#212224" : "white",
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                {calendar.title}
              </Text>
            </Button>
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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode='date'
        locale={lang}
        customConfirmButtonIOS={({ label, onPress }) => (
          <Button style={styles.saveDateButton} onPress={onPress}>
            <Text style={styles.saveDateButtonLabel}>{label}</Text>
          </Button>
        )}
        customCancelButtonIOS={() => (
          <View style={{ height: 50, backgroundColor: "none" }} />
        )}
        onConfirm={(date) => {
          setCurrentDate(date);
          setDatePickerVisibility(false);
        }}
        display='inline'
        onCancel={() => setDatePickerVisibility(false)}
        confirmTextIOS={translator.t("save")}
        cancelTextIOS={translator.t("cancel")}
      />
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
  allButton: {
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    marginRight: 10,
    gap: 8,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: theme.NEUTRAL[800],
  },
  calenderButton: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    marginRight: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: theme.NEUTRAL[800],
  },
  calenderIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
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
    padding: 17,
    margin: 4,
    borderRadius: 10,
  },
  saveDateButtonLabel: {
    color: theme.NEUTRAL[900],
    textAlign: "center",
    fontSize: 18,
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
