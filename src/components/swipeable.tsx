import theme from "@/styles/theme";
import React from "react";
import { View } from "react-native";

import Swipeable from "react-native-gesture-handler/Swipeable";
import Button from "@/components/button";
import { TrashIcon } from "./icon";

const ListItem = ({ children, enabled, onPress }) => (
  <Swipeable
    enabled={enabled}
    renderRightActions={() => (
      <Button
        onPress={onPress}
        style={{
          backgroundColor: "#dc2626",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        <TrashIcon size={26} color='white' />
      </Button>
    )}
  >
    <View
      style={{
        backgroundColor: theme.GRAY[500],
      }}
    >
      {children}
    </View>
  </Swipeable>
);

export default ListItem;
