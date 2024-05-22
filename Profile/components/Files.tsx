import React from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FileItem } from "../types/profile";
import { useTranslation } from "react-i18next";

type FilesProps = {
  files: FileItem[];
  onAddFile: () => void;
  onViewFile: (url: string) => void;
};

const Files: React.FC<FilesProps> = ({ files, onAddFile, onViewFile }) => {
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: FileItem }) => {
    const iconName =
      item.file_type === "passport" ? "passport" : "document-text"; // Example: change as needed
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => onViewFile(item.url)}
      >
        {/* <Ionicons name={iconName} size={24} color="#000" /> */}
        <MaterialCommunityIcons
          name="passport-biometric"
          size={24}
          color="black"
        />
        <Text style={styles.text}>{item.file_type}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.filesContainer}>
      <TouchableOpacity onPress={onAddFile} style={styles.addButton}>
        <Text style={styles.addButtonText}>
          {t("profile.form.documents.actions.add")}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Files;

const styles = StyleSheet.create({
  filesContainer: {
    // marginVertical: 15,
    marginBottom: 15,
  },
  addButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FAF9FE",
    alignItems: "center",
    marginBottom: 15,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  item: {
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  text: {
    marginTop: 5,
    fontWeight: "500",
  },
});
