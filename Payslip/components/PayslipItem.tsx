import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import { Payslip } from "../types/payslip";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { parseISO, format } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";

// import RNFetchBlob from "rn-fetch-blob";

const PayslipItem = (payslip: Payslip) => {
  // Function to handle download
  const { t, i18n } = useTranslation();

  // const handleDownload = () => {
  //   if (!payslip.file_url) {
  //     console.error("File URL is not available.");
  //     return;
  //   }

  //   Alert.alert(
  //     "Download Payslip",
  //     "Do you want to download the payslip?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Download",
  //         onPress: () => Linking.openURL(payslip.file_url as string),
  //       },
  //     ],
  //     { cancelable: true }
  //   );
  // };

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
  const date = parseISO(payslip.release_date.toString());
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
        {payslip.details && <Text style={styles.detailsText}>{`備考: ${payslip.details}`}</Text>}
        <Text>{`${t("payslip.item.netSalary")}: ¥ ${payslip.net_salary}`}</Text>
        <Text>{`${t("payslip.item.totalDeduction")}: ¥ ${
          payslip.total_deduction
        }`}</Text>
        <Text>{`${t("payslip.item.totalHoursWorked")}: ${
          payslip.total_hours
        }`}</Text>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          onPress={() => handleView(payslip.file_url as string)}
          style={styles.iconButton}
        >
          <AntDesign name="eye" size={26} color="#9A2F7C" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleShare(payslip.file_url as string)}
          style={styles.iconButton}
        >
          <FontAwesome name="share" size={24} color="#9A2F7C" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PayslipItem;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: "#fff",
    flexDirection: "row", // Makes the card flex horizontally
    justifyContent: "space-between", // Spaces out the columns
    alignItems: "center", // Aligns items vertically
  },
  detailsContainer: {
    flex: 0.8, // Takes 80% of the space, adjust as needed
  },
  iconsContainer: {
    flex: 0.2, // Takes 20% of the space, adjust as needed
    flexDirection: "column",
    alignItems: "flex-end", // Center align the icons vertically
    justifyContent: "flex-end", // Center align the icons horizontally
  },
  iconButton: {
    // marginVertical: 10,  // Space between icons
    padding: 10,
    // backgroundColor: "red",
    // color: "#9A2F7C",
  },
  headerText: {
    marginBottom: 5,
    fontSize: 18,
    fontWeight: "bold",
    color: "#9A2F7C",
  },
  detailsText: {
    marginBottom: 10,
    
    fontSize: 16,
  }
  // Additional styles...
});
