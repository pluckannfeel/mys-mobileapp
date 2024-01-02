import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../core/theme/theme";

type ProfileImageWithFabProps = {
  imageUrl: string;
  onImagePress: () => void;
  onFabPress: () => void;
};

const ProfileImageWithFab: React.FC<ProfileImageWithFabProps> = ({
  imageUrl,
  onImagePress,
  onFabPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onImagePress}>
        <Image source={{ uri: imageUrl }} style={styles.profileImage} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.fab} onPress={onFabPress}>
        <Ionicons name="camera" size={24} color="#5A5A5A" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileImageWithFab;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginVertical: 40,
    alignSelf: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.green300, // Replace with your desired color
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
