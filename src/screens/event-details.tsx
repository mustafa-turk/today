import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const EventDetails = ({ navigation, route }) => {
  const { event, calendars } = route.params;

  const onSave = () => {};
  const onCancel = () => {
    navigation.goBack();
  };

  const onTimeChange = (event) => {
    if (event.type === "dismissed") {
      // update here startDate or endDate
    }
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
        // onChangeText={onChangeText}
        value={event.title}
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
            style={{
              backgroundColor: "#262626",
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
              gap: 6,
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
            themeVariant='dark'
            accentColor='white'
            textColor='white'
            value={new Date(event.startDate)}
            mode='time'
            onChange={onTimeChange}
            is24Hour
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
            themeVariant='dark'
            accentColor='white'
            textColor='white'
            value={new Date(event.endDate)}
            mode='time'
            onChange={() => {}}
            is24Hour
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
