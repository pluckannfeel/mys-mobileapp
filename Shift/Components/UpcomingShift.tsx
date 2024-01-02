import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { format, parseISO } from "date-fns";
import { ShiftSchedule } from "../types/Shift";
import { convertToTimeString } from "../../core/helpers/functions";
import { utcToZonedTime } from "date-fns-tz";
import { useUpcomingShift } from "../hooks/useUpcomingShift";

type UpcomingShiftProps = {
  shift: ShiftSchedule;
};

const UpcomingShift: React.FC<UpcomingShiftProps> = ({ shift }) => {
  if (!shift) {
    // Return null or some placeholder content indicating no data is available
    return (
      <View style={styles.card}>
        <Text>No upcoming shifts.</Text>
      </View>
    );
  }

  const startTimeString = shift.start
    ? convertToTimeString(utcToZonedTime(shift.start, "Asia/Tokyo"))
    : "";
  const endTimeString = shift.end
    ? convertToTimeString(utcToZonedTime(shift.end, "Asia/Tokyo"))
    : "";

  let endTime = endTimeString === "00:00" ? "24:00" : endTimeString;
  let serviceHours =
    startTimeString && endTime ? `${startTimeString} - ${endTime}` : "";

  // Format the date only if start is a valid date string
  const formattedDate = shift.start
    ? format(new Date(shift.start), "EEE, MMM d")
    : "";

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.leftColumn}>
        <Text style={styles.headerText}>Upcoming Shift</Text>
        <Text style={styles.boldText}>{shift?.patient}</Text>
        <Text>{formattedDate}</Text>
      </View>
      <View style={styles.rightColumn}>
        <Text>{serviceHours}</Text>
        <Text>{shift.duration}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  boldText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  // ... Add other styles as needed
});

export default UpcomingShift;
