
import * as React from "react";
import * as Calendar from "expo-calendar";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import * as dateUtils from "@/utils/date";
import theme from "@/styles/theme";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { EventType, RootStackParamList } from "@/utils/types";

type EventDetailsScreenRouteProp = RouteProp<RootStackParamList, 'EventDetails'>;

type EventDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetails'>;

type Props = {
  route: EventDetailsScreenRouteProp;
  navigation: EventDetailsScreenNavigationProp;
};

const EventDetails: React.FC<Props> = ({ navigation, route }) => {
  const { event, defaultCalendarId, date, calendars, isEmpty } = route.params;

  const emptyEvent = {
    calendarId: defaultCalendarId,
    startDate: new Date(date),
    endDate: dateUtils.getDayPlusHours(date, 1),
    title: "",
  };

  const [updatedEvent, setUpdatedEvent] = React.useState<EventType | Partial<EventType>>(
    isEmpty ? emptyEvent : event
  );

  const goBack = () => {
    navigation.navigate("Home", { date });
  };

  const onSave = async () => {
    if (isEmpty) {
      await Calendar.createEventAsync(updatedEvent.calendarId, {
        title: updatedEvent.title,
        startDate: updatedEvent.startDate,
        endDate: updatedEvent.endDate,
      });
    } else {
      await Calendar.updateEventAsync(updatedEvent.id, {
        title: updatedEvent.title,
        startDate: updatedEvent.startDate,
        endDate: updatedEvent.endDate,
        calendarId: updatedEvent.calendarId,
      });
    }
    goBack();
  };

  const onDelete = async () => {
    await Calendar.deleteEventAsync(updatedEvent.id);
    goBack();
  };

  const onCancel = () => {
    goBack();
  };

  const onTitleChange = (title: string) => {
    setUpdatedEvent({ ...updatedEvent, title });
  };

  const onStartTimeChange = (event: DateTimePickerEvent, date: Date) => {
    if (event.type !== "dismissed") {
      setUpdatedEvent({
        ...updatedEvent,
        startDate: new Date(date),
      });
    }
  };

  const onEndTimeChange = (event: DateTimePickerEvent, date: Date) => {
    if (event.type !== "dismissed") {
      setUpdatedEvent({
        ...updatedEvent,
        endDate: new Date(date),
      });
    }
  };

  const onCalendarPress = (calendarId: string) => {
    setUpdatedEvent({
      ...updatedEvent,
      calendarId,
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 30,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSave}>
          <Text style={{ ...styles.cancel, color: "white" }}>Save</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={{
          borderRadius: 10,
          padding: 16,
          backgroundColor: "#262626",
          fontSize: 18,
          color: "white",
        }}
        placeholder='Event title'
        placeholderTextColor='#d4d4d4'
        onChangeText={onTitleChange}
        value={updatedEvent.title}
        autoCorrect={false}
        keyboardAppearance='dark'
        autoCapitalize='none'
        autoComplete='off'
      />

      {isEmpty && (
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginBottom: 20,
            marginTop: 10,
            flexWrap: "wrap",
          }}
        >
          {calendars.map((calendar, key) => (
            <TouchableOpacity
              key={key}
              activeOpacity={0.8}
              onPress={() => onCalendarPress(calendar.id)}
              style={{
                backgroundColor: "#262626",
                padding: 12,
                borderRadius: 8,
                flexDirection: "row",
                gap: 6,
                borderWidth: 1,
                borderColor:
                  calendar.id === updatedEvent.calendarId
                    ? "#525252"
                    : "#262626",
              }}
            >
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
                  color: "white",
                  fontSize: 16,
                }}
              >
                {calendar.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ marginTop: 10, gap: 10 }}>
        <View
          style={{
            backgroundColor: "#262626",
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.NEUTRAL[400], fontSize: 18 }}>Starts at</Text>
          <DateTimePicker
            locale={"en_GB"}
            themeVariant='dark'
            accentColor='white'
            textColor='white'
            value={new Date(updatedEvent.startDate)}
            mode='time'
            onChange={onStartTimeChange}
          />
        </View>

        <View
          style={{
            backgroundColor: "#262626",
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: theme.NEUTRAL[400], fontSize: 18 }}>Ends at</Text>
          <DateTimePicker
            locale={"en_GB"}
            themeVariant='dark'
            accentColor='white'
            textColor='white'
            value={new Date(updatedEvent.endDate)}
            mode='time'
            onChange={onEndTimeChange}
          />
        </View>
      </View>

      {!isEmpty && (
        <TouchableOpacity onPress={onDelete}>
          <Text
            style={{ ...styles.cancel, textAlign: "center", marginTop: 30 }}
          >
            Delete Event
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
    padding: 20,
  },
  cancel: {
    color: "#ef4444",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default EventDetails;
