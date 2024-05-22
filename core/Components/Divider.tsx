import { StyleSheet, View } from "react-native";

const Divider = () => <View style={styles.divider} />;

export default Divider;

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#7F8487",
  },
});
