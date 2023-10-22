import "react-native-gesture-handler";

import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import HomeScreen from "@/screens/home";
import EventDetails from "@/screens/event-details";
import NewCalendar from "@/screens/new-calendar";
import GrantAccessScreen from "@/screens/get-started/grant-access";
import GetStartedScreen from "@/screens/get-started/get-started";

import { RootStackParamList } from "@/utils/types";
import { SCREENS, STORAGE } from "@/utils/constants";

import "@/utils/i18n";

const Stack = createStackNavigator<RootStackParamList>();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [launchRouteName, setLaunchRouteName] = React.useState(null);

  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [notification, setNotification] =
    React.useState<Notifications.Notification>(null);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  React.useEffect(() => {
    (async () => {
      const hasLaunched = await AsyncStorage.getItem(STORAGE.HAS_LAUNCHED);
      if (hasLaunched) {
        setLaunchRouteName(SCREENS.HOME);
      } else {
        await AsyncStorage.setItem(STORAGE.HAS_LAUNCHED, "1");
        setLaunchRouteName(SCREENS.GET_STARTED);
      }
    })();
  }, []);

  return (
    <>
      <StatusBar style='light' hideTransitionAnimation='slide' />
      {launchRouteName && (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={launchRouteName}
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name={SCREENS.GET_STARTED}
              component={GetStartedScreen}
            />
            <Stack.Screen
              name={SCREENS.GRANT_ACCESS}
              component={GrantAccessScreen}
            />
            <Stack.Screen name={SCREENS.HOME} component={HomeScreen} />
            <Stack.Screen
              name={SCREENS.EVENT_DETAILS}
              component={EventDetails}
              options={{
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name={SCREENS.NEW_CALENDAR}
              component={NewCalendar}
              options={{
                presentation: "modal",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}

async function registerForPushNotificationsAsync() {
  let token: string;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  return token;
}
