import * as React from "react";
import * as Calendar from "expo-calendar";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import HomeScreen from "@/screens/home";
import EventDetails from "@/screens/event-details";
import NewCalendar from "@/screens/new-calendar";
import GrantAccessScreen from "@/screens/grant-access";

import { RootStackParamList } from "@/utils/types";

import "@/utils/i18n";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isAccessGranted, setAccessGranted] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      setAccessGranted(status === "granted");
    };

    init();
  }, []);

  return (
    <>
      <StatusBar style='light' />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isAccessGranted ? (
            <Stack.Screen name='Home' component={HomeScreen} />
          ) : (
            <Stack.Screen name='GrantAccess' component={GrantAccessScreen} />
          )}
          <Stack.Screen
            name='EventDetails'
            component={EventDetails}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forModalPresentationIOS,
            }}
          />
          <Stack.Screen
            name='NewCalendar'
            component={NewCalendar}
            options={{
              cardStyleInterpolator:
                CardStyleInterpolators.forModalPresentationIOS,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
