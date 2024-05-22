import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import { TaxCertificate } from "../types/taxcertificate";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { parseISO, format } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";

const TaxcertificateItem = (taxcertificate: TaxCertificate) => {
  // Function to handle download
  const { t, i18n } = useTranslation();

  const handleView = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open URL");
      }
    } catch (error) {
      console.error("An error occurred", error);
      Alert.alert("Error", "Failed to open URL");
    }
  };

  const handleShare = async (url: string) => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(url);
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (error) {
      console.error("An error occurred", error);
      Alert.alert("Error", "Failed to share");
    }
  };

  // Parse the ISO string into a Date object
  const date = parseISO(taxcertificate.release_date.toString());
  const locale = i18n.language === "en" ? enUS : ja;

  // Format the date to get the month name in Japanese
  const monthName = format(date, "MMMM", { locale: locale }); // e.g., 1月 for January
  const year = format(date, "yyyy"); // e.g., 2023

  return (
    <View style={styles.card}>
      <View style={styles.detailsContainer}>
        <Text style={styles.headerText}>{`${year}${
          i18n.language === "ja" ? "年" : ""
        } ${monthName}`}</Text>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          onPress={() => handleView(taxcertificate.file_url as string)}
          style={styles.iconButton}
        >
          <AntDesign name="eye" size={26} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleShare(taxcertificate.file_url as string)}
          style={styles.iconButton}
        >
          <FontAwesome name="share" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaxcertificateItem;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#fff",
    flexDirection: "row", // Makes the card flex horizontally
    justifyContent: "space-between", // Spaces out the columns
    alignItems: "center", // Aligns items vertically
  },
  detailsContainer: {
    flex: 0.8, // Takes 80% of the space, adjust as needed
    alignItems: "flex-start", // Aligns the text to the left
    justifyContent: "center", // Center align the text vertically
  },
  iconsContainer: {
    flex: 0.2, // Takes 20% of the space, adjust as needed
    flexDirection: "row",
    alignItems: "center", // Center align the icons vertically
    justifyContent: "flex-end", // Center align the icons horizontally
  },
  iconButton: {
    // marginVertical: 10,  // Space between icons
    padding: 10,
    // backgroundColor: "red",
  },
  headerText: {
    // marginBottom: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  // Additional styles...
});
