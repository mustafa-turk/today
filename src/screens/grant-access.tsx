import { Text, View } from "react-native";

import Screen from "@/components/screen";

import theme from "@/styles/theme";

const GrantAccess = () => {
  return (
    <Screen>
      <Text>Please do something</Text>
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
            color: theme.NEUTRAL[300],
            fontWeight: "800",
            fontSize: 38,
            marginBottom: 10,
          }}
        >
          Today
        </Text>
        <Text
          style={{
            color: theme.NEUTRAL[500],
            fontWeight: "600",
            fontSize: 18,
            marginBottom: 40,
          }}
        >
          A minimalistic calendar app that lets you focus on what is important
          for today.
        </Text>
      </View>
    </Screen>
  );
};

export default GrantAccess;
