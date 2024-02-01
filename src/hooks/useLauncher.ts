import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SCREENS, STORAGE } from "@/utils/constants";

export default function useLauncher() {
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

  return {
    launchRouteName,
  };
}
