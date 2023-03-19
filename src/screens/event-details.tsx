import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as Calendar from "expo-calendar";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

const EventDetails = ({ navigation, route }) => {
  const { event, calendars } = route.params;
  const [updatedEvent, setUpdatedEvent] = useState(event);

  const onSave = async () => {
    await Calendar.updateEventAsync(updatedEvent.id, {
      title: updatedEvent.title,
      startDate: updatedEvent.startDate,
      endDate: updatedEvent.endDate,
      calendarId: updatedEvent.calendarId,
    });
    navigation.goBack();
  };

  const onCancel = () => {
    navigation.goBack();
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
          <Text style={styles.cancel}>Close</Text>
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

      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginTop: 20,
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
                calendar.id === updatedEvent.calendarId ? "#525252" : "#262626",
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

      <View style={{ marginTop: 20, gap: 10 }}>
        <View
          style={{
            backgroundColor: "#262626",
            borderRadius: 10,
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Starts at</Text>
          <DateTimePicker
            locale={"en_GB"}
            themeVariant='dark'
            accentColor='white'
            textColor='white'
            value={new Date(event.startDate)}
            mode='time'
            onChange={onStartTimeChange}
          />
        </View>

        <View
          style={{
            backgroundColor: "#262626",
            borderRadius: 10,
            padding: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 18 }}>Ends at</Text>
          <DateTimePicker
            locale={"en_GB"}
            themeVariant='dark'
            accentColor='white'
            textColor='white'
            value={new Date(event.endDate)}
            mode='time'
            onChange={onEndTimeChange}
          />
        </View>
      </View>
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
