import "react-native-gesture-handler";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "@/screens/home";
import EventDetails from "@/screens/event-details";
import NewCalendar from "@/screens/new-calendar";
import GrantAccessScreen from "@/screens/get-started/grant-access";
import GetStartedScreen from "@/screens/get-started/get-started";

import useNotifications from "@/hooks/use-notifications";
import useLauncher from "@/hooks/use-launcher";

import { RootStackParamList } from "@/utils/types";
import { SCREENS } from "@/utils/constants";

import "@/utils/i18n";

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const { launchRouteName } = useLauncher();
  useNotifications();

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
