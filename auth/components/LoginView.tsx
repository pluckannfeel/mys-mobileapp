import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { oneFourthHeight } from "../../core/constants/dimensions";

type MainViewProps = {
  children: React.ReactNode;
};

const MainView = ({ children }: MainViewProps) => {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Image
        style={styles.backgroundImage}
        source={require("../../assets/images/light_bg.png")}
      />

      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/myslogowhite.png")}
        />
      </View>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    position: "absolute",
    top: oneFourthHeight,
  },
  logo: {
    width: 200,
    height: 95,
  },
});

export default MainView;
