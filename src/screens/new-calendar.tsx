import * as React from "react";
import * as Calendar from "expo-calendar";

import {
  View,
  StyleSheet,
  TextInput
} from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";

import { RootStackParamList } from "@/utils/types";

import ModalScreen from "@/components/modal-screen";
import theme from "@/styles/theme";
import Button from "@/components/button";

type NewCalendarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NewCalendar'>;

type Props = {
  navigation: NewCalendarScreenNavigationProp;
};

const CALENDAR_COLORS = ['#8b5cf6', '#6366f1', '#d946ef', '#0ea5e9', '#10b981', '#eab308']

const NewCalendar: React.FC<Props> = (props) => {
  const [title, setTitle] = React.useState('');
  const [color, setColor] = React.useState(CALENDAR_COLORS[0]);

  const createCalendar = async () => {
    await Calendar.createCalendarAsync({ color, title, entityType: Calendar.EntityTypes.EVENT })
  }

  return (
    <ModalScreen isEmpty {...props} onSave={createCalendar}>
      <TextInput
        style={{
          borderRadius: 10,
          padding: 16,
          backgroundColor: "#262626",
          fontSize: 18,
          color: "white",
        }}
        placeholder='Calendar name'
        placeholderTextColor='#d4d4d4'
        onChangeText={setTitle}
        value={title}
        autoCorrect={false}
        keyboardAppearance='dark'
        autoCapitalize='none'
        autoComplete='off'
      />
      <View style={{ gap: 6, flexDirection: 'row', marginTop: 20 }}>
        {CALENDAR_COLORS.map(c => <Button onPress={() => setColor(c)} style={{ borderRadius: 20, backgroundColor: c, width: 35, height: 35, borderWidth: 2, borderColor: color === c ? theme.NEUTRAL[200] : "transparent", padding: 4 }} />)}
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({});

export default NewCalendar;
