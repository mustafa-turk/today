import * as Calendar from "expo-calendar";
import * as Linking from "expo-linking";

import { useEffect } from "react";

import { Text, View } from "react-native";

import Screen from "@/components/screen";

import theme from "@/styles/theme";
import Button from "@/components/button";
import { ShieldIcon } from "@/components/icon";

import translator from "@/utils/i18n";
import { SCREENS } from "@/utils/constants";

const GrantAccess = ({ navigation }) => {
  const [status, requestPermission] = Calendar.useCalendarPermissions();

  useEffect(() => {
    if (status?.granted) {
      navigation.navigate(SCREENS.HOME);
    }
  }, [status?.granted]);

  const handleRequestPermission = () => {
    if (status.canAskAgain) {
      requestPermission();
    } else {
      Linking.openSettings();
    }
  };

  return (
    <Screen>
      <View
        style={{
          paddingHorizontal: 20,
          justifyContent: "space-between",
          flex: 1,
          marginBottom: 100,
        }}
      >
        <View>
          <Text
            style={{
              color: theme.NEUTRAL[100],
              fontWeight: "800",
              fontSize: 38,
              marginBottom: 30,
            }}
          >
            {translator.t("access")}
          </Text>
          <Text
            style={{
              color: "white",
              fontWeight: "500",
              fontSize: 18,
              marginBottom: 15,
            }}
          >
            {translator.t("allow_access")}
          </Text>
          <Text
            style={{
              color: "white",
              fontWeight: "500",
              fontSize: 18,
            }}
          >
            {translator.t("personal_data")}
          </Text>
        </View>

        <View style={{ gap: 30 }}>
          <View
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}
          >
            <ShieldIcon color={theme.NEUTRAL[100]} size={20} />
            <Text
              style={{
                color: "white",
                fontWeight: "500",
                fontSize: 18,
              }}
            >
              {translator.t("private_info")}
            </Text>
          </View>
          <Button
            onPress={handleRequestPermission}
            style={{
              backgroundColor: theme.BLUE,
              padding: 16,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {translator.t("allow")}
            </Text>
          </Button>
        </View>
      </View>
    </Screen>
  );
};

export default GrantAccess;
