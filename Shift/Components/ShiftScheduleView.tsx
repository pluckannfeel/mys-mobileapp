import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Platform,
  FlatList,
} from "react-native";
import React from "react";
import { ShiftSchedule } from "../types/Shift";
import { format, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { convertToTimeString } from "../../core/helpers/functions";
import { useTranslation } from "react-i18next";

interface ScheduleViewProps {
  schedules: ShiftSchedule[];
  pressShift: (schedule: ShiftSchedule) => void;
}

const ShiftScheduleView: React.FC<ScheduleViewProps> = ({
  schedules,
  pressShift,
}) => {
  // console.log(schedules)
  // convert start and end time

  const { t } = useTranslation();

  const renderItem = ({
    item,
    index,
  }: {
    item: ShiftSchedule;
    index: number;
  }) => {
    const bgStyles = index % 2 === 0;
    const itemStyles = index % 2 === 0 ? styles.itemLight : styles.itemDark;

    // get hour and minute from start and end time it should be 2:00 - 3:00
    const startTime = convertToTimeString(
      utcToZonedTime(item.start, "Asia/Tokyo")
    );
    let endTime = convertToTimeString(utcToZonedTime(item.end, "Asia/Tokyo"));

    if (endTime === "00:00") endTime = "24:00";

    return (
      <TouchableOpacity
        style={[styles.scheduleItem, itemStyles]}
        onPress={() => pressShift(item)}
      >
        <View style={styles.timeAndDuration}>
          <Text
            style={[styles.timeText, itemStyles]}
          >{`${startTime} - ${endTime}`}</Text>
          <Text style={[styles.durationText, itemStyles]}>
            {item.duration} mins
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={[styles.patientText, itemStyles]}>{item.patient}</Text>
          <Text style={[styles.serviceTypeText, itemStyles]}>
            {item.service_type}
          </Text>
          <Text style={[styles.serviceDetailsText, itemStyles]}>
            {item.service_details}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Text style={styles.shiftHeader}>
        {t("shift.defaultScreen.scheduleTitle")}
      </Text>
      <FlatList
        data={schedules}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList} // Make sure to use a style that doesn't conflict with the FlatList's own scrolling
      />
    </>
  );
};

const styles = StyleSheet.create({
  flatList: {
    paddingHorizontal: 10,
  },
  shiftHeader: {
    paddingHorizontal: 20,
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 20,
  },
  scheduleItem: {
    flexDirection: "row", // Align children in a row
    justifyContent: "space-between", // Put space between the children
    alignItems: "center", // Center items vertically
    width: "100%",
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  timeAndDuration: {
    flex: 1, // Take up half the width of the container
  },
  details: {
    flex: 1, // Take up the remaining half
    alignItems: "flex-end", // Align items to the right
  },
  timeText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  durationText: {
    fontSize: 16,
  },
  patientText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  serviceTypeText: {
    fontSize: 18,
  },
  serviceDetailsText: {
    fontSize: 18,
  },
  itemLight: {
    backgroundColor: "#fb7185",
    color: "#fff",
  },
  itemDark: {
    backgroundColor: "#EBEEF4",
    color: "#000",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 16,
  },

  // ... other styles you may have
});

export default ShiftScheduleView;
