// this component is using lottie for animation
import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
// import LottieView, { AnimationObject } from "lottie-react-native";
import { HEIGHT } from "../constants/dimensions";
import { useTranslation } from "react-i18next";

// Update the type for the component's props
type InProgressProps = {
  // source: AnimationObject | { uri: string } | string;
};

const ServerError: React.FC<InProgressProps> = ({ 
  // source
 }) => {
  const { t } = useTranslation();

  return (
    // <View style={styles.container}>
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <LottieView source={source} autoPlay loop style={styles.animation} /> */}
      <Text style={styles.text}>{t("common.serverError")}</Text>
    </View>
  );
};

export default ServerError;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 80,
    //   paddingHorizontal: 20, // Adjust or remove as needed
    // The red background color for debugging is fine here.
  },
  animation: {
    // Removed flex: 1 to stop the LottieView from filling up all available space
    // marginRight,
    // alignSelf: "center",
    width: "80%", // You may keep maxWidth if you want it to be responsive
    height: "80%", // Adjust this to the actual height of the visible animation
    // Removed alignSelf: 'stretch' to stop stretching across the container
    // The blue background color for debugging is fine here.
  },
  text: {
    fontSize: 24,
    fontWeight: "500",
    //   color: "black",
    textAlign: "center",
    // This ensures the text stays at the bottom of the animation
    position: "absolute",
    bottom: HEIGHT - 650, // Adjust this value to position the text correctly
  },
});
