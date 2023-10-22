import theme from "@/styles/theme";
import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import translator from "@/utils/i18n";
import { SCREENS } from "@/utils/constants";

type Props = {
  children: JSX.Element | JSX.Element[];
  navigation: any;
  isEmpty: boolean;
  onSave: Function;
  canSave: boolean;
};

const ModalScreen: React.FC<Props> = ({
  children,
  navigation,
  isEmpty,
  onSave,
  canSave,
}) => {
  const goBack = () => {
    navigation.navigate(SCREENS.HOME);
  };

  const handleSave = async () => {
    await onSave();
    goBack();
  };

  const handleDelete = () => {
    goBack();
  };

  const handleCancel = () => {
    goBack();
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginBottom: 30,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancel}>{translator.t("cancel")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} disabled={!canSave}>
          <Text
            style={{
              ...styles.cancel,
              color: canSave ? theme.NEUTRAL[100] : theme.NEUTRAL[700],
              fontWeight: "600",
            }}
          >
            {translator.t("save")}
          </Text>
        </TouchableOpacity>
      </View>

      {children}

      {!isEmpty && (
        <TouchableOpacity onPress={handleDelete}>
          <Text
            style={{ ...styles.cancel, textAlign: "center", marginTop: 30 }}
          >
            {translator.t("delete_event")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.NEUTRAL[950],
    padding: 20,
  },
  cancel: {
    color: "#ef4444",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default ModalScreen;
