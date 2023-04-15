import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import HomeScreen from "@/screens/home";
import EventDetails from "@/screens/event-details";
import NewCalendar from "@/screens/new-calendar";
import GrantAccessScreen from "@/screens/get-started/grant-access";
import GetStartedScreen from "@/screens/get-started/get-started";

import { RootStackParamList } from "@/utils/types";
import { SCREENS, STORAGE } from "@/utils/constants";

import "@/utils/i18n";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [launchRouteName, setLaunchRouteName] = React.useState(null);

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
      <StatusBar style='light' />
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
                cardStyleInterpolator:
                  CardStyleInterpolators.forModalPresentationIOS,
              }}
            />
            <Stack.Screen
              name={SCREENS.NEW_CALENDAR}
              component={NewCalendar}
              options={{
                cardStyleInterpolator:
                  CardStyleInterpolators.forModalPresentationIOS,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
