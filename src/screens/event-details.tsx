import * as React from "react";
import * as Calendar from "expo-calendar";
import {
  Keyboard,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import TextInput from "@/components/text-input";
import CalendarSelector from "@/components/calendar-selector";

import * as dateUtils from "@/utils/date";
import theme from "@/styles/theme";
import translator from "@/utils/i18n";

import * as calendar from "@/utils/calendar";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { EventType, RootStackParamList } from "@/utils/types";

import { SCREENS } from "@/utils/constants";
import EventService from "@/services/events-service";

type EventDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "EVENT_DETAILS"
>;

type EventDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EVENT_DETAILS"
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

  const [shouldNotifyBefore, setNotifyBefore] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      if (event?.id) {
        const notificationId = await AsyncStorage.getItem(event.id);
        setNotifyBefore(Boolean(notificationId));
      }
    })();
  }, [event]);

  const isStartDateFuture = dateUtils.isFutureEvent(
    new Date(updatedEvent.startDate)
  );

  const goBack = () => {
    navigation.navigate(SCREENS.HOME, { date });
  };

  const onSave = async () => {
    let eventId: string;

    await EventService.createOrUpdateEvent(updatedEvent, isEmpty);

    if (isStartDateFuture) {
      await EventService.scheduleNotification(
        eventId,
        updatedEvent.title,
        updatedEvent.startDate,
        shouldNotifyBefore
      );
    }
    goBack();
  };

  const canSave = Boolean(updatedEvent.title);

  const onDelete = async () => {
    await EventService.deleteEvent(updatedEvent.id);
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

  const onStartTimeChange = (
    event: DateTimePickerEvent,
    selectedDate: Date
  ) => {
    const currentDate = new Date(date);
    const hours = new Date(selectedDate).getHours();
    const minutes = new Date(selectedDate).getMinutes();
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);

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
    const minutes = new Date(selectedDate).getMinutes();
    currentDate.setHours(hours);
    currentDate.setMinutes(minutes);

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
          ...styles.horizontalSafeAreaPadding,
          marginTop: 20,
          paddingBottom: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancel}>{translator.t("cancel")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSave} disabled={!canSave}>
          <Text
            style={{
              ...styles.cancel,
              color: canSave ? theme.NEUTRAL[100] : theme.NEUTRAL[700],
              fontWeight: "600",
            }}
          >
            {translator.t("save")}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        onScroll={() => Keyboard.dismiss()}
        style={{ paddingTop: 20 }}
      >
        <View style={{ ...styles.horizontalSafeAreaPadding, marginBottom: 20 }}>
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: theme.NEUTRAL[200],
                fontSize: 16,
                fontWeight: "500",
                marginBottom: 10,
              }}
            >
              {translator.t("title")}
            </Text>
            <TextInput
              placeholder={translator.t("event_title")}
              onChangeText={onTitleChange}
              value={updatedEvent.title}
              editable={updatedEvent.allowsModifications}
            />
          </View>

          <View>
            <Text
              style={{
                color: theme.NEUTRAL[200],
                fontSize: 16,
                fontWeight: "500",
                marginBottom: 10,
              }}
            >
              {translator.t("notes")}
            </Text>
            <TextInput
              placeholder={translator.t("event_notes")}
              onChangeText={onNotesChange}
              value={updatedEvent.notes}
              editable={updatedEvent.allowsModifications}
              multiline
              style={{
                height: 120,
                paddingTop: 14,
              }}
            />
          </View>
        </View>

        {isEmpty && (
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                color: theme.NEUTRAL[200],
                fontSize: 16,
                fontWeight: "500",
                marginBottom: 10,
                ...styles.horizontalSafeAreaPadding,
              }}
            >
              {translator.t("calendar")}
            </Text>
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal
              style={{
                paddingLeft: 20,
              }}
            >
              {calendar
                .filterWritableCalendars(calendars)
                .map((calendar, key) => (
                  <CalendarSelector
                    key={key}
                    color={calendar.color}
                    isActive={calendar.id === updatedEvent.calendarId}
                    onPress={() => onCalendarPress(calendar.id)}
                  >
                    {calendar.title}
                  </CalendarSelector>
                ))}
              <View style={{ marginRight: 30 }} />
            </ScrollView>
          </View>
        )}

        <View style={{ ...styles.horizontalSafeAreaPadding }}>
          <Text
            style={{
              color: theme.NEUTRAL[200],
              fontSize: 16,
              fontWeight: "500",
              marginBottom: 10,
            }}
          >
            {translator.t("duration")}
          </Text>
          <View
            style={{
              backgroundColor: theme.NEUTRAL[900],
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: theme.NEUTRAL[800],
              borderBottomWidth: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          >
            <Text style={{ color: theme.NEUTRAL[400], fontSize: 18 }}>
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
              backgroundColor: theme.NEUTRAL[900],
              paddingHorizontal: 16,
              paddingVertical: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: theme.NEUTRAL[800],
              borderBottomWidth: 0,
              borderRadius: 0,
            }}
          >
            <Text style={{ color: theme.NEUTRAL[400], fontSize: 18 }}>
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

          <View
            style={{
              backgroundColor: theme.NEUTRAL[900],
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderWidth: 1,
              borderColor: theme.NEUTRAL[800],
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          >
            <Text style={{ color: theme.NEUTRAL[400], fontSize: 18 }}>
              {translator.t("alert")}
            </Text>
            <Switch
              trackColor={{ false: theme.NEUTRAL[900], true: theme.BLUE }}
              ios_backgroundColor={theme.NEUTRAL[900]}
              onValueChange={() => setNotifyBefore(!shouldNotifyBefore)}
              value={shouldNotifyBefore}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.NEUTRAL[950],
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
  },
  calenderIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  horizontalSafeAreaPadding: {
    paddingHorizontal: 20,
  },
});

export default EventDetails;
