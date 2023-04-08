import * as React from "react";
import * as Calendar from "expo-calendar";

import { View } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "@/utils/types";

import ModalScreen from "@/components/modal-screen";
import Button from "@/components/button";
import TextInput from "@/components/text-input";

import theme from "@/styles/theme";

type NewCalendarScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewCalendar"
>;

type Props = {
  navigation: NewCalendarScreenNavigationProp;
};

const CALENDAR_COLORS = [
  "#8b5cf6",
  "#6366f1",
  "#d946ef",
  "#0ea5e9",
  "#10b981",
  "#eab308",
];

const NewCalendar: React.FC<Props> = (props) => {
  const [title, setTitle] = React.useState("");
  const [color, setColor] = React.useState(CALENDAR_COLORS[0]);

  const createCalendar = async () => {
    await Calendar.createCalendarAsync({
      color,
      title,
      entityType: Calendar.EntityTypes.EVENT,
    });
  };

  return (
    <ModalScreen isEmpty {...props} onSave={createCalendar}>
      <TextInput
        placeholder='Calendar name'
        onChangeText={setTitle}
        value={title}
        style={{}}
      />
      <View style={{ gap: 6, flexDirection: "row", marginTop: 20 }}>
        {CALENDAR_COLORS.map((c) => (
          <Button
            key={c}
            onPress={() => setColor(c)}
            style={{
              borderRadius: 20,
              backgroundColor: c,
              width: 35,
              height: 35,
              borderWidth: 2,
              borderColor: color === c ? theme.NEUTRAL[200] : "transparent",
              padding: 4,
            }}
          />
        ))}
      </View>
    </ModalScreen>
  );
};

export default NewCalendar;
