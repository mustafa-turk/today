import { Text, View } from "react-native";

import Screen from "@/components/screen";

import theme from "@/styles/theme";
import Button from "@/components/button";

import { SCREENS } from "@/utils/constants";
import translator from "@/utils/i18n";

const GetStarted = ({ navigation }) => {
  return (
    <Screen>
      <View
        style={{
          paddingHorizontal: 20,
          justifyContent: "flex-end",
          flex: 1,
          marginBottom: 100,
        }}
      >
        <Text
          style={{
            color: theme.NEUTRAL[100],
            fontWeight: "800",
            fontSize: 38,
            marginBottom: 10,
          }}
        >
          Today
        </Text>
        <Text
          style={{
            color: theme.NEUTRAL[400],
            fontWeight: "600",
            fontSize: 18,
            marginBottom: 40,
          }}
        >
          {translator.t("tagline")}
        </Text>

        <Button
          onPress={() => navigation.navigate(SCREENS.GRANT_ACCESS)}
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
            {translator.t("get_started")}
          </Text>
        </Button>
      </View>
    </Screen>
  );
};

export default GetStarted;
