import React, { useState } from "react";
import { View, StyleSheet, Button, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
// import AnchorPopupMenu from "./AnchorPopupMenu";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Divider from "./Divider";
import { useTranslation } from "react-i18next";

export type File = {
  uri: string;
  type: string;
};

interface FileInputProps {
  onFileSelect: (file: File) => void;
}

interface MenuOptionType {
  text: string;
  onSelect: () => void;
  icon: keyof typeof MaterialCommunityIcons.glyphMap; // Strongly type the icon names
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect }) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const [isUploaded, setIsUploaded] = useState(false);

  const handleSelect = (action: () => Promise<void>) => {
    setVisible(false); // Close the menu before executing the action
    action().then();
  };

  const pickImageFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileType = fileInfo ? fileInfo.uri.split(".").pop() : "unknown";

      onFileSelect({
        uri,
        type: fileType as string,
      });
      setIsUploaded(true);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileType = fileInfo ? fileInfo.uri.split(".").pop() : "unknown";

      onFileSelect({
        uri,
        type: fileType as string,
      });
      setIsUploaded(true);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });
    if (!result.canceled && result.assets) {
      const uri = result.assets[0].uri;
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const fileType = fileInfo ? fileInfo.uri.split(".").pop() : "unknown";

      onFileSelect({
        uri,
        type: fileType as string,
      });
      setIsUploaded(true);
    }
  };

  const menuOptions: MenuOptionType[] = [
    {
      text: t("licenses.form.file.options.files"),
      onSelect: () => handleSelect(pickDocument),
      icon: "file-pdf-box",
    },
    {
      text: t("licenses.form.file.options.gallery"),
      onSelect: () => handleSelect(pickImageFromGallery),
      icon: "file-image-outline",
    },
    {
      text: t("licenses.form.file.options.photo"),
      onSelect: () => handleSelect(takePhoto),
      icon: "camera",
    },
  ];

  return (
    <Menu onBackdropPress={() => setVisible(false)}>
      <MenuTrigger
        text={
          isUploaded
            ? t("licenses.form.file.change")
            : t("licenses.form.file.select")
        }
        customStyles={{
          triggerText: {
            fontSize: 16,
            color: "#000",
            fontWeight: "bold",
          },
          triggerWrapper: {
            // padding: 10,
            paddingRight: 15,
          },
        }}
      />
      <MenuOptions
        customStyles={{
          optionsContainer: {
            borderRadius: 10,
          },
          optionWrapper: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          },
        }}
      >
        {menuOptions.map((option, index) => (
          <View key={index}>
            <MenuOption onSelect={option.onSelect} style={styles.menuOption}>
              <Text style={styles.textStyle}>{option.text}</Text>
              <Text style={styles.iconStyle}>
                <MaterialCommunityIcons name={option.icon} size={20} />
              </Text>
            </MenuOption>
            {index < menuOptions.length - 1 && <Divider />}
          </View>
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default FileInput;

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  menuOption: {
    // flexDirection: "row",
    padding: 8,
    // alignItems: "center",
    // justifyContent: "center",
  },
  iconStyle: {
    marginRight: 10,
  },
  textStyle: {
    fontSize: 14,
  },
});
