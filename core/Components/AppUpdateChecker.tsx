import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import { axiosInstance } from "../../api/server";
import { useTranslation } from "react-i18next";
import { useSecureStorage } from "../hooks/useSecureStorage";

const AppUpdateChecker: React.FC = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [getItem, setItem] = useSecureStorage("hasDismissedUpdate", false); // Using your custom hook
  const { t } = useTranslation();

  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const appVersion = Constants.expoConfig?.version || ""; // Current app version

        const response = await axiosInstance.get(`/get_app_version`);
        const latestVersion = response.data;

        if (appVersion < latestVersion) {
          const currentVersion = Constants.expoConfig?.version || "0.0.0"; // Current app version

          if (currentVersion < latestVersion) {
            setIsUpdateAvailable(true);
          }
        }
      } catch (error) {
        console.error("Error checking for updates:", error);
      }
    };

    // Check if the user has already dismissed the update notification
    if (!getItem) {
      checkForUpdate();
    }
  }, [getItem]);

  const handleUpdate = () => {
    const appStoreUrl = "https://apps.apple.com/app/mirai-care/id6473826441"; // Replace with your App Store URL
    Linking.openURL(appStoreUrl);

    setItem(true);

    // Close the modal
    setIsUpdateAvailable(false);
  };

  const handleDismiss = async () => {
    // Save that the user has dismissed the update notification
    setItem(true);
    setIsUpdateAvailable(false); // Close the modal
  };

  return (
    <Modal visible={isUpdateAvailable} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t("version.updateAvailable")}</Text>
          <Text style={styles.message}>{t("version.message")}</Text>

          {/* Buttons grouped in one row */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={handleUpdate}
            >
              <Text style={styles.buttonText}>{t("common.updateNow")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.dismissButton]}
              onPress={handleDismiss}
            >
              <Text style={styles.buttonText}>{t("common.dismiss")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "48%", // To make the buttons equal width
  },
  updateButton: {
    backgroundColor: "#9A2F7C",
  },
  dismissButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
  },
});

export default AppUpdateChecker;
