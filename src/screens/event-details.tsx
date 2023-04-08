
import * as React from "react";
import * as Calendar from "expo-calendar";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import TextInput from "@/components/text-input";

import * as dateUtils from "@/utils/date";
import theme from "@/styles/theme";

import * as calendar from "@/utils/calendar";

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
    startDate: dateUtils.getDayPlusHours(date, 1),
    endDate: dateUtils.getDayPlusHours(date, 2),
    title: "",
    allowsModifications: true
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
        notes: updatedEvent.notes,
      });
    } else {
      await Calendar.updateEventAsync(updatedEvent.id, {
        title: updatedEvent.title,
        startDate: updatedEvent.startDate,
        endDate: updatedEvent.endDate,
        calendarId: updatedEvent.calendarId,
        notes: updatedEvent.notes,
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

  const onNotesChange = (notes: string) => {
    setUpdatedEvent({ ...updatedEvent, notes });
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
          alignItems: 'center'
        }}
      >
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        {!updatedEvent.allowsModifications && <View style={{ backgroundColor: "#ef4444", alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
          <Text style={{ color: 'white' }}>Read-only</Text>
        </View>}

        <TouchableOpacity onPress={onSave}>
          <Text style={{ ...styles.cancel, color: "white" }}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 10, marginBottom: 30 }}>
        <TextInput
          placeholder='Event Title'
          onChangeText={onTitleChange}
          value={updatedEvent.title}
          editable={updatedEvent.allowsModifications}
        />

        <TextInput
          placeholder='Event Notes'
          onChangeText={onNotesChange}
          value={updatedEvent.notes}
          editable={updatedEvent.allowsModifications}
        />

        {isEmpty && (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {calendar.filterWritableCalendars(calendars).map((calendar, key) => (
              <TouchableOpacity
                key={key}
                activeOpacity={0.8}
                onPress={() => onCalendarPress(calendar.id)}
                style={{
                  backgroundColor: theme.GRAY[300],
                  padding: 12,
                  borderRadius: 8,
                  flexDirection: "row",
                  gap: 6,
                  borderWidth: 1,
                  borderColor:
                    calendar.id === updatedEvent.calendarId
                      ? theme.GRAY[100]
                      : theme.GRAY[300],
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
      </View>

      <View style={{ marginTop: 10, gap: 10 }}>
        <View
          style={{
            backgroundColor: theme.GRAY[300],
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
            disabled={!updatedEvent.allowsModifications}
          />
        </View>

        <View
          style={{
            backgroundColor: theme.GRAY[300],
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
            disabled={!updatedEvent.allowsModifications}
          />
        </View>
      </View>

      {!isEmpty && updatedEvent.allowsModifications && (
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
    backgroundColor: theme.GRAY[400],
    padding: 20,
  },
  cancel: {
    color: "#ef4444",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default EventDetails;
