import { View, StyleSheet } from "react-native";

type ScreenProps = {
  children: JSX.Element | JSX.Element[];
};

const Screen = (props: ScreenProps) => {
  return <View style={styles.screen}>{props.children}</View>;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "black",
    paddingTop: 80,
  },
});

export default Screen;
