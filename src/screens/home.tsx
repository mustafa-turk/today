import { useEffect } from "react";
import {
  ScrollView, StyleSheet, Text, TouchableHighlight, View
} from "react-native";

import Event from "@/components/event";
import { ArrowLeft, ArrowRight, PlusIcon } from "@/components/icon";

import { useCalendar } from "@/hooks/use-calendar";
import theme from "@/styles/theme";
import { getDay, getDayDigits, getMonth } from "@/utils/date";

const HomeScreen = ({ navigation, route }) => {
  const date = route?.params?.date || new Date()
  const { currentDate, events, calendars, getEvents, defaultCalendarId } = useCalendar(date);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getEvents(currentDate);
    });

    return unsubscribe;
  }, [navigation]);

  const onNextPress = async () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    await getEvents(nextDate);
  };

  const onBackPress = async () => {
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    await getEvents(previousDate);
  };

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
          onPress={onBackPress}
        >
          <Text style={styles.buttonIcon}>
            <ArrowLeft size={24} />
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          activeOpacity={0.7}
          style={styles.button}
          onPress={onNextPress}
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
          onPress={() => navigation.navigate("EventDetails", { defaultCalendarId, date: currentDate, calendars, isEmpty: true })}
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
                onPress={() => navigation.navigate("EventDetails", { event, calendars })}
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
