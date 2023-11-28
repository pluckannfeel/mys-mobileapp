import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { eachDayOfInterval, format, startOfDay, endOfDay } from "date-fns";
import { useHeaderHeight } from "@react-navigation/elements";

// import { Stack } from "expo-router";;
import { getDayKanji } from "../../core/helpers/functions";
import ShiftScheduleView from "../../Shift/Components/ShiftScheduleView";
import { ShiftReport, ShiftSchedule } from "../../Shift/types/Shift";
import { StatusBar } from "expo-status-bar";
import { WIDTH as SCREEN_WIDTH } from "../../core/constants/dimensions";
import { startOfMonth, endOfMonth } from "date-fns";

import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { timeZone } from "../../core/constants/time";
import { ja } from "date-fns/locale";
import { useSettings } from "../../core/contexts/SettingsProvider";
import ReportBottomSheet from "./ReportBottomSheet";
import { useSelectedShift } from "../contexts/SelectedShiftProvider";
import { useTranslation } from "react-i18next";

const ITEM_WIDTH = 80; // The width of your date item component
const ITEM_MARGINRIGHT = 10; // The margin right of your date item component
const paddingHorizontalValue = (SCREEN_WIDTH - ITEM_WIDTH - 5) / 2;

// this is the shift schedule items

interface ShiftItemProps {
  // buttonRef?: React.RefObject<TouchableOpacity>;
  date: Date;
  isActive: boolean;
  onSelect: (date: Date) => void;
}

const ShiftItem: React.FC<ShiftItemProps> = React.memo(
  ({ date, isActive, onSelect }) => {
    const { language } = useSettings();

    const dayKanji = getDayKanji(date, language);
    const dayNumber = format(date, "d");

    const dateItemStyle = React.useMemo(
      () => ({
        ...styles.dateItem,
        backgroundColor: isActive ? "#71CD47" : "#FAF9FE",
      }),
      [isActive]
    );

    return (
      <TouchableOpacity
        // ref={buttonRef}
        style={dateItemStyle}
        onPress={() => onSelect(date)}
      >
        <Text style={styles.dayText}>{dayKanji}</Text>
        <Text style={styles.dayNumber}>{dayNumber}</Text>
      </TouchableOpacity>
    );
  }
);

// main default view component

type Props = {
  // submitShiftReport: (values: ShiftReport) => void;
  shifts: ShiftSchedule[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
};

const DefaultView: React.FC<Props> = ({
  // submitShiftReport,
  selectedDate,
  setSelectedDate,
  shifts,
}) => {
  // get HeaderHeight
  const headerHeight = useHeaderHeight();
  // const theme = useTheme();
  const { setSelectedShift } = useSelectedShift();
  // const { t } = useTranslation();

  // bottom sheet shift report form
  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(false);

  // general
  const flatListRef = React.useRef<FlatList>(null);
  // Generate an array of dates for the current week
  const startOfCurrentMonth = startOfMonth(selectedDate);
  const endOfCurrentMonth = endOfMonth(selectedDate);
  const zonedStart = startOfDay(utcToZonedTime(startOfCurrentMonth, timeZone));
  const zonedEnd = endOfDay(utcToZonedTime(endOfCurrentMonth, timeZone));
  const weekDates = eachDayOfInterval({
    start: zonedStart,
    end: zonedEnd,
  }).map((date) => startOfDay(utcToZonedTime(date, timeZone)));
  const initialScrollIndex: number = weekDates.findIndex(
    (item) => format(item, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  useEffect(() => {
    // Assuming the FlatList is fully rendered here
    setTimeout(() => {
      const index = weekDates.findIndex(
        (item) =>
          format(item, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
      );

      if (flatListRef.current && index >= 0) {
        flatListRef.current.scrollToIndex({
          index: index,
          animated: false,
        });

        // Give it time to scroll to the initial index, then adjust
        setTimeout(() => {
          if (flatListRef.current && index >= 0) {
            flatListRef.current.scrollToIndex({
              index: index,
              animated: true,
              viewPosition: 0.5, // This should center the item
            });
          }
        }, 100); // Adjust this timing as needed
      }
    }, 0);
  }, []);

  const handleSelectDate = (date: Date) => {
    // console.log(date);
    // Convert the selected date to the start of the day in the local time zone
    const zonedDate = startOfDay(utcToZonedTime(date, timeZone));
    const formattedSelectedDate = format(zonedDate, "yyyy-MM-dd", {
      locale: ja,
    });

    setSelectedDate(zonedDate);

    // Find the new index based on the zoned date
    const index = weekDates.findIndex(
      (item) =>
        format(utcToZonedTime(item, timeZone), "yyyy-MM-dd") ===
        formattedSelectedDate
    );

    if (flatListRef.current && index >= 0) {
      flatListRef.current.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  // Function to open the bottom sheet
  const handleOpen = () => {
    setIsBottomSheetVisible(true);
  };

  const handleClose = () => {
    setIsBottomSheetVisible(false);
  };

  // onPressShift
  const pressShiftHandler = (schedule: Partial<ShiftSchedule>) => {
    setSelectedShift(schedule as ShiftSchedule);

    handleOpen();
    // handleOpen();
  };

  // data from shiftreport form (this is the submit handler drilled 2 times)
  // const submitShiftReportHandler = (values: ShiftReport) => {
  //   submitShiftReport(values);
  // };

  // date day flatlist items
  const renderItem = useCallback(
    ({ item }: { item: Date }) => (
      <ShiftItem
        // buttonRef={shiftItemRef}˝
        date={item}
        isActive={
          format(item, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
        }
        onSelect={handleSelectDate}
      />
    ),
    [selectedDate, handleSelectDate]
  );

  return (
    <Fragment>
      <SafeAreaView
        style={[styles.container, { marginTop: headerHeight + 10 }]}
      >
        {/* <View style={styles.header}> */}
        {/* <Text style={styles.monthTitle}>{format(new Date(), "MMMM")}</Text> */}
        {/* <TouchableOpacity onPress={ScheduleViewTypeHandler}>
              <Ionicons name="add-circle-outline" size={24} color="black" />
            </TouchableOpacity> */}
        {/* </View> */}
        <FlatList<Date>
          ref={flatListRef}
          horizontal
          initialScrollIndex={initialScrollIndex}
          // scrollEnabled={true}
          data={weekDates}
          renderItem={renderItem}
          keyExtractor={(item) => item.toISOString()}
          showsHorizontalScrollIndicator={false}
          // contentContainerStyle={{
          //   paddingHorizontal: paddingHorizontalValue, // This should be half the width of the screen or enough to allow the items to be centered
          // }}
          getItemLayout={(data, index) => ({
            length: ITEM_WIDTH,
            offset: ITEM_WIDTH * index + ITEM_MARGINRIGHT * index,
            index,
          })}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={7}
        />

        <View style={styles.scheduleView}>
          {/* <Text style={styles.scheduleText}>
              Your schedule for today: {selectedDate.toDateString()}
            </Text> */}
        </View>
      </SafeAreaView>
      {/* compare dayNumber and data's day number by searching on to data's startDate, if matches show shift schedule view */}
      <SafeAreaView>
        <ShiftScheduleView
          pressShift={pressShiftHandler}
          // schedules={shifts.filter((schedule) => {
          //   const startDay = format(new Date(schedule.start), "d");
          //   const selectedDay = format(selectedDate, "d");
          //   // Compare the formatted strings
          //   return startDay === selectedDay;
          // })}
          schedules={shifts.filter((schedule) => {
            const start = new Date(schedule.start);
            const end = new Date(schedule.end);
            const selectedDateStart = new Date(
              Date.UTC(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate()
              )
            );
            const selectedDateEnd = new Date(
              Date.UTC(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate() + 1
              )
            );

            // Check if the end time is exactly midnight
            const isEndMidnight =
              end.getHours() === 0 &&
              end.getMinutes() === 0 &&
              end.getSeconds() === 0;

            // For a shift that ends at exactly midnight, exclude it from the next day
            if (isEndMidnight) {
              return (
                start < selectedDateEnd &&
                end > selectedDateStart &&
                end.getDate() === selectedDateStart.getDate()
              );
            }

            // For all other shifts, use the original condition
            return start < selectedDateEnd && end > selectedDateStart;
          })}
        />
      </SafeAreaView>

      {/* // form */}
      {isBottomSheetVisible && (
        <ReportBottomSheet
          // info={{} as ShiftReport}
          // onSubmit={submitShiftReportHandler}
          isVisible={isBottomSheetVisible}
          onClose={handleClose}
        />
      )}
    </Fragment>
  );
};

export default DefaultView;

const styles = StyleSheet.create({
  container: {
    // Your container styles
    // paddingTop: headerHeight,
    padding: 10,
  },
  header: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    padding: 10,
  },
  monthTitle: {
    // Styles for the month title
    fontWeight: "bold",
    fontSize: 24,
  },
  dateItem: {
    backgroundColor: "#FAF9FE", // Grey background
    borderRadius: 12, // Rounded corners
    padding: 10, // Padding inside the item
    marginRight: ITEM_MARGINRIGHT, // Space between items
    width: ITEM_WIDTH, // Fixed width
    alignItems: "center", // Center text vertically
    justifyContent: "center", // Center text horizontally
  },
  activeDateItem: {
    backgroundColor: "#71CD47", // Green background for active items
    color: "#FFF", // White text color for active items
  },
  dayText: {
    fontWeight: "500",
    fontSize: 18, // Font size for the day text (Mon, Tue, etc.)
    color: "#000", // Text color
  },
  dayNumber: {
    fontSize: 24, // Font size for the day number (1, 2, 3, etc.)
    fontWeight: "bold", // Bold font weight
    color: "#000", // Text color
  },
  scheduleView: {
    // Styles for the schedule view
    padding: 10,
  },
  scheduleText: {
    // Styles for the schedule text
  },
});
