import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert,
} from "react-native";
import React from "react";
import { Payslip } from "../types/payslip";
import { MaterialIcons } from "@expo/vector-icons";
import { parseISO, format } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

// import RNFetchBlob from "rn-fetch-blob";

const PayslipItem = (payslip: Payslip) => {
  // Function to handle download
  const { t, i18n } = useTranslation();

  const handleDownload = () => {
    if (!payslip.file_url) {
      console.error("File URL is not available.");
      return;
    }

    Alert.alert(
      "Download Payslip",
      "Do you want to download the payslip?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download",
          onPress: () => Linking.openURL(payslip.file_url as string),
        },
      ],
      { cancelable: true }
    );
  };

  // Parse the ISO string into a Date object
  const date = parseISO(payslip.release_date.toString());
  const locale = i18n.language === "en" ? enUS : ja;

  // Format the date to get the month name in Japanese
  const monthName = format(date, "MMMM", { locale: locale }); // e.g., 1月 for January
  const year = format(date, "yyyy"); // e.g., 2023

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{`${year} ${monthName} `}</Text>
        <TouchableOpacity onPress={handleDownload}>
          <MaterialIcons name="file-download" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <Text>{`${t("payslip.item.netSalary")}: ¥ ${payslip.net_salary}`}</Text>
        <Text>{`${t("payslip.item.totalDeduction")}: ¥ ${
          payslip.net_salary
        }`}</Text>
        <Text>{`${t("payslip.item.totalHoursWorked")}: ${
          payslip.net_salary
        }`}</Text>
      </View>
    </View>
  );
};

export default PayslipItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Add your styling here
  },
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    // Add shadows and other styling
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    // Style for details section
  },
  // Add more styles as needed
});
