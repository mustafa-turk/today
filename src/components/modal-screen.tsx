import theme from "@/styles/theme";
import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import translator from "@/utils/i18n";

type Props = {
  children: JSX.Element | JSX.Element[];
  navigation: any;
  isEmpty: boolean;
  onSave: Function;
};

const ModalScreen: React.FC<Props> = ({
  children,
  navigation,
  isEmpty,
  onSave,
}) => {
  const goBack = () => {
    navigation.navigate("Home");
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

        <TouchableOpacity onPress={handleSave}>
          <Text style={{ ...styles.cancel, color: "white" }}>
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
    backgroundColor: theme.GRAY[500],
    padding: 20,
  },
  cancel: {
    color: "#ef4444",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default ModalScreen;
