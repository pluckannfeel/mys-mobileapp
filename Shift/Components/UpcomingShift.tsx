import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { format, parse, parseISO } from "date-fns";
import { ShiftSchedule } from "../types/Shift";
import { convertToTimeString } from "../../core/helpers/functions";
import { utcToZonedTime } from "date-fns-tz";
import { useUpcomingShift } from "../hooks/useUpcomingShift";
import { UserInfo } from "../../auth/types/userInfo";
import { useTranslation } from "react-i18next";
import { enUS, ja } from "date-fns/locale";

type UpcomingShiftProps = {
  userInfo: UserInfo;
};

const UpcomingShift: React.FC<UpcomingShiftProps> = ({ userInfo }) => {
  const { t, i18n } = useTranslation();

  // upcoming shift data
  const { data: upcomingShift } = useUpcomingShift(
    userInfo.japanese_name as string
  );

  // console.log("upcomingShift", upcomingShift);

  if (!upcomingShift || !upcomingShift.start) {
    // Return null or some placeholder content indicating no data is available
    return (
      <View style={styles.card}>
        <Text style={styles.headerText}>{t("upcomingShift.title")}</Text>
        <Text style={styles.date}>{t("upcomingShift.empty")}</Text>
      </View>
    );
  }

  const timeZone = "Asia/Tokyo";

  const startTimeString = upcomingShift.start
    ? convertToTimeString(utcToZonedTime(upcomingShift.start, "Asia/Tokyo"))
    : "";
  const endTimeString = upcomingShift.end
    ? convertToTimeString(utcToZonedTime(upcomingShift.end, "Asia/Tokyo"))
    : "";

  let endTime = endTimeString === "00:00" ? "24:00" : endTimeString;
  let serviceHours =
    startTimeString && endTime ? `${startTimeString} - ${endTime}` : "";

  const date = new Date(parseISO(upcomingShift.start.toString()));

  // Define options for date formatting
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  };
  const locale = i18n.language === "en" ? "en-US" : "ja-JP";

  // Format the date
  const formattedDate = new Intl.DateTimeFormat(locale, dateOptions).format(
    date
  );

  const patient_or_service_details =
  upcomingShift.patient !== "nan"
    ? upcomingShift.patient
    : upcomingShift.service_details;

  // console.log(date);
  // console.log(formattedDate);
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.leftColumn}>
        <Text style={styles.headerText}>{t("upcomingShift.title")}</Text>
        <Text style={styles.patient}>{patient_or_service_details}</Text>
      </View>
      <View style={styles.rightColumn}>
        <Text style={styles.date}>{formattedDate}</Text>
        <Text style={styles.serviceHours}>{serviceHours}</Text>
        <Text style={styles.duration}>{`${upcomingShift.duration} ${
          i18n.language === "en" ? "Minutes" : "時間"
        }`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    paddingVertical: 20,
    paddingHorizontal: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  leftColumn: {
    justifyContent: "center",
  },
  rightColumn: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "400",
    fontStyle: "italic",
    marginBottom: 12,
  },
  date: {
    fontSize: 20,
    marginBottom: 4,
  },
  patient: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 2,
  },
  serviceHours: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  duration: {
    fontSize: 18,
  },
  // ... Add other styles as needed
});

export default UpcomingShift;
