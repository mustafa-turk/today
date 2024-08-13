import * as React from "react";
import { Text, View, StyleSheet } from "react-native";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import Button from "@/components/button";

import translator from "@/utils/i18n";
import theme from "@/styles/theme";

import { supportedLang } from "@/utils/lang";

const DatePicker = ({ isVisible, setDatePickerVisibility, onConfirm }) => {
  const lang = supportedLang();

  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode='date'
      locale={lang}
      customConfirmButtonIOS={({ label, onPress }) => (
        <Button style={styles.confirmButton} onPress={onPress}>
          <Text style={styles.confirmButtonLabel}>{label}</Text>
        </Button>
      )}
      customCancelButtonIOS={() => (
        <View style={{ height: 50, backgroundColor: "none" }} />
      )}
      onConfirm={(date) => {
        onConfirm(date);
        setDatePickerVisibility(false);
      }}
      display='inline'
      onCancel={() => setDatePickerVisibility(false)}
      confirmTextIOS={translator.t("save")}
      cancelTextIOS={translator.t("cancel")}
    />
  );
};

const styles = StyleSheet.create({
  confirmButton: {
    backgroundColor: theme.NEUTRAL[100],
    padding: 16,
    margin: 4,
    borderRadius: 12,
  },
  confirmButtonLabel: {
    color: theme.NEUTRAL[900],
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
  },
});

export default DatePicker;
