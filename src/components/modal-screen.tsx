
import theme from "@/styles/theme";
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

type Props = {
  children: JSX.Element | JSX.Element[],
  navigation: any,
  isEmpty: boolean,
  onSave: Function
}

const ModalScreen: React.FC<Props> = ({ children, navigation, isEmpty, onSave }) => {
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
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave}>
          <Text style={{ ...styles.cancel, color: "white" }}>Save</Text>
        </TouchableOpacity>
      </View>

      {children}

      {!isEmpty && (
        <TouchableOpacity onPress={handleDelete}>
          <Text
            style={{ ...styles.cancel, textAlign: "center", marginTop: 30 }}
          >
            Delete Event
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.GRAY[400],
    padding: 20,
  },
  cancel: {
    color: "#ef4444",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default ModalScreen;
