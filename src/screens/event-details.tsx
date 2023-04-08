import * as React from "react";
import * as Calendar from "expo-calendar";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import TextInput from "@/components/text-input";

import * as dateUtils from "@/utils/date";
import theme from "@/styles/theme";
import translator from "@/utils/i18n";

import * as calendar from "@/utils/calendar";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { EventType, RootStackParamList } from "@/utils/types";
import Button from "@/components/button";

type EventDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "EventDetails"
>;

type EventDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EventDetails"
>;

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
    allowsModifications: true,
  };

  const [updatedEvent, setUpdatedEvent] = React.useState<
    EventType | Partial<EventType>
  >(isEmpty ? emptyEvent : event);

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
        location: updatedEvent.location,
      });
    } else {
      await Calendar.updateEventAsync(updatedEvent.id, {
        title: updatedEvent.title,
        startDate: updatedEvent.startDate,
        endDate: updatedEvent.endDate,
        calendarId: updatedEvent.calendarId,
        notes: updatedEvent.notes,
        location: updatedEvent.location,
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

  const onLocationChange = (location: string) => {
    setUpdatedEvent({ ...updatedEvent, location });
  };

  const onNotesChange = (notes: string) => {
    setUpdatedEvent({ ...updatedEvent, notes });
  };

  const onStartTimeChange = (
    event: DateTimePickerEvent,
    selectedDate: Date
  ) => {
    const currentDate = new Date(date);
    const hours = new Date(selectedDate).getHours();
    currentDate.setHours(hours);

    if (event.type !== "dismissed") {
      setUpdatedEvent({
        ...updatedEvent,
        startDate: new Date(currentDate),
      });
    }
  };

  const onEndTimeChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = new Date(date);
    const hours = new Date(selectedDate).getHours();
    currentDate.setHours(hours);

    if (event.type !== "dismissed") {
      setUpdatedEvent({
        ...updatedEvent,
        endDate: new Date(currentDate),
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
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancel}>{translator.t("cancel")}</Text>
        </TouchableOpacity>

        {!updatedEvent.allowsModifications && (
          <View
            style={{
              backgroundColor: "#ef4444",
              alignSelf: "center",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white" }}>Read-only</Text>
          </View>
        )}

        <TouchableOpacity onPress={onSave}>
          <Text style={{ ...styles.cancel, color: "white" }}>
            {translator.t("save")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 20 }}>
        <TextInput
          placeholder={translator.t("event_title")}
          onChangeText={onTitleChange}
          value={updatedEvent.title}
          editable={updatedEvent.allowsModifications}
          style={{
            borderBottomWidth: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        />

        <TextInput
          placeholder={translator.t("event_notes")}
          onChangeText={onNotesChange}
          value={updatedEvent.notes}
          editable={updatedEvent.allowsModifications}
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        />

        <TextInput
          placeholder={translator.t("event_location")}
          onChangeText={onLocationChange}
          value={updatedEvent.location}
          editable={updatedEvent.allowsModifications}
          style={{ marginTop: 20 }}
        />
      </View>

      {isEmpty && (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          {calendar.filterWritableCalendars(calendars).map((calendar, key) => (
            <Button
              key={key}
              onPress={() => onCalendarPress(calendar.id)}
              style={{
                ...styles.calenderButton,
                borderRadius: 10,
                backgroundColor:
                  calendar.id === updatedEvent.calendarId
                    ? theme.NEUTRAL[100]
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
                  color:
                    calendar.id === updatedEvent.calendarId
                      ? theme.GRAY[500]
                      : "white",
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                {calendar.title}
              </Text>
            </Button>
          ))}
        </View>
      )}

      <View>
        <View
          style={{
            backgroundColor: theme.GRAY[300],
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.GRAY[100],
            borderBottomWidth: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <Text style={{ color: "#707d8a", fontSize: 18 }}>
            {translator.t("starts_at")}
          </Text>
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
            borderWidth: 1,
            borderColor: theme.GRAY[100],
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <Text style={{ color: "#707d8a", fontSize: 18 }}>
            {translator.t("ends_at")}
          </Text>
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
            {translator.t("delete_event")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.GRAY[500],
    padding: 20,
  },
  cancel: {
    color: "#ef4444",
    fontWeight: "500",
    fontSize: 16,
  },
  calenderButton: {
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: theme.GRAY[100],
  },
  calenderIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
});

export default EventDetails;
