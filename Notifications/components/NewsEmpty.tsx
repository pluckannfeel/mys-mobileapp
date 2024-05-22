// Empty.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface EmptyProps {
  label: string;
}

const NewsEmpty: React.FC<EmptyProps> = ({ label }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/newspaper.png")}
        style={styles.image}
      />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 75,
    height: 75,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});

export default NewsEmpty;
