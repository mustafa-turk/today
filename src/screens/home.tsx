import * as React from "react";
import { find, isEmpty } from "lodash";

import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

import Event from "@/components/event";
import Button from "@/components/button";
import Screen from "@/components/screen";
import Swipeable from "@/components/swipeable";
import { ArrowLeft, ArrowRight, PlusIcon } from "@/components/icon";

import useCalendars from "@/hooks/use-calendars";

import * as date from "@/utils/date";
import translator from "@/utils/i18n";
import theme from "@/styles/theme";

import { RootStackParamList } from "@/utils/types";
import { CALENDAR_REDUCER_TYPES, SCREENS } from "@/utils/constants";

type HomeScreenRouteProp = RouteProp<RootStackParamList, "HOME">;

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "HOME">;

type Props = {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { reset, state, dispatch, removeEvent } = useCalendars();

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.date) {
        reset(new Date(route.params.date));
      }
    }, [route.params?.date])
  );

  const eventsLabel = `${state.events.length} ${
    state.events.length === 1 ? translator.t("event") : translator.t("events")
  }`;

  const isCalendarWritable = find(
    state.calendars,
    (cal) => cal.id === state.currentCalendarId
  )?.allowsModifications;

  return (
    <Screen>
      <Button
        onPress={() =>
          dispatch({
            type: CALENDAR_REDUCER_TYPES.SET_CURRENT_DATE,
            payload: new Date(),
          })
        }
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
          {date.isToday(state.currentDate)
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
          onPress={() =>
            dispatch({
              type: CALENDAR_REDUCER_TYPES.SET_CURRENT_DATE,
              payload: date.getPreviousDay(state.currentDate),
            })
          }
        >
          <ArrowLeft size={24} color={theme.NEUTRAL[400]} />
        </Button>

        <View style={{ justifyContent: "center" }}>
          <Text style={styles.title}>{date.getDay(state.currentDate)}</Text>
          <Text style={styles.date}>{`${date.getDayDigits(
            state.currentDate
          )} ${date.getMonth(state.currentDate)}`}</Text>
        </View>

        <Button
          style={styles.button}
          onPress={() =>
            dispatch({
              type: CALENDAR_REDUCER_TYPES.SET_CURRENT_DATE,
              payload: date.getNextDay(state.currentDate),
            })
          }
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
            onPress={() =>
              dispatch({
                type: CALENDAR_REDUCER_TYPES.SET_CURRENT_CALENDAR_ID,
                payload: "all",
              })
            }
            style={{
              ...styles.allButton,
              backgroundColor:
                state.currentCalendarId === "all"
                  ? theme.NEUTRAL[100]
                  : theme.NEUTRAL[950],
            }}
          >
            <>
              <Text
                style={{
                  color:
                    state.currentCalendarId === "all" ? "#212224" : "white",
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                {translator.t("all")}
              </Text>
            </>
          </Button>
          {state.calendars.map((calendar, key) => (
            <Button
              key={key}
              onPress={() =>
                dispatch({
                  type: CALENDAR_REDUCER_TYPES.SET_CURRENT_CALENDAR_ID,
                  payload: calendar.id,
                })
              }
              style={{
                ...styles.calenderButton,
                backgroundColor:
                  state.currentCalendarId === calendar.id
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
                    state.currentCalendarId === calendar.id
                      ? "#212224"
                      : "white",
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
                calendars: state.calendars,
                defaultCalendarId:
                  state.currentCalendarId === "all" || !isCalendarWritable
                    ? state.defaultCalendarId
                    : state.currentCalendarId,
                date: state.currentDate.toISOString(),
                isEmpty: true,
              })
            }
            style={styles.eventsContainerHeaderButton}
          >
            <PlusIcon size={21} color={theme.NEUTRAL[900]} />
          </Button>
        </View>
        {isEmpty(state.events) ? (
          <Text style={styles.eventsContainerEmptyMessage}>
            {translator.t("looks_empty")}
          </Text>
        ) : (
          <FlatList
            ItemSeparatorComponent={() => (
              <View style={styles.eventsListSeperator} />
            )}
            showsVerticalScrollIndicator={false}
            data={state.events}
            renderItem={({ item: event }) => (
              <Swipeable
                onPress={() => removeEvent(event.id)}
                enabled={event.allowsModifications}
              >
                <Event
                  disabled={!event.allowsModifications}
                  details={event}
                  onPress={() =>
                    navigation.navigate(SCREENS.EVENT_DETAILS, {
                      event,
                      calendars: state.calendars,
                      date: state.currentDate.toISOString(),
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
