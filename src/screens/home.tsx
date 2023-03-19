import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
} from "react-native";

import Event from "@/components/event";
import { ArrowLeft, ArrowRight, PlusIcon } from "@/components/icon";

import { useCalendar } from "@/hooks/use-calendar";
import { getMonth, getDayDigits, getDay } from "@/utils/date";

const HomeScreen = ({ navigation }) => {
  const { currentDate, events, calendars, getEvents } = useCalendar();

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

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.title}>{getDay(currentDate)}, </Text>
        <Text style={styles.date}>{`${getMonth(currentDate)} ${getDayDigits(
          currentDate
        )}`}</Text>
      </View>
      <Text style={{ ...styles.title, color: "#d4d4d4" }}>
        {`${events.length} ${events.length === 1 ? "meeting" : "meetings"}`}
      </Text>

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

      <View style={styles.eventsContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.eventsList}
        >
          <View style={{ gap: 16, marginBottom: 48 }}>
            {events?.map((event, key) => (
              <Event
                details={event}
                key={key}
                onPress={() =>
                  navigation.navigate("EventDetails", { event, calendars })
                }
              />
            ))}
            {events.length === 0 && (
              <View>
                <TouchableHighlight
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: "#e5e5e5",
                    padding: 29,
                    borderRadius: 20,
                  }}
                >
                  <Text style={styles.buttonIcon}>
                    <PlusIcon size={36} />
                  </Text>
                </TouchableHighlight>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
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
    backgroundColor: "white",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  eventsList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
});

export default HomeScreen;
