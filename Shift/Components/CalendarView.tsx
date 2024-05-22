import React, {
  useState,
  Fragment,
  useCallback,
  useMemo,
  useRef,
  Component,
  useEffect,
} from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";

import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  Calendar,
  LocaleConfig,
} from "react-native-calendars";

import calendarIDS from "../../core/constants/calendar";
import { getTheme, themeColor, lightThemeColor } from "../mock/theme";
import CalendarItem from "./CalendarItem";
import { useHeaderHeight } from "@react-navigation/elements";
import { ShiftReport, ShiftSchedule } from "../types/Shift";
import { ja } from "date-fns/locale";
import { addDays, format, startOfDay, subDays } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { timeZone } from "../../core/constants/time";

const leftArrowIcon = require("../../assets/images/previous.png");
const rightArrowIcon = require("../../assets/images/next.png");
import {
  AgendaEntry,
  DateData,
  MarkedDates,
} from "react-native-calendars/src/types";
import isEmpty from "lodash/isEmpty";
import { ShiftAgendaItem, AgendaItems } from "../types/Calendar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../core/theme/theme";
import BottomSheet from "@gorhom/bottom-sheet";
import ShiftReportForm from "./ShiftReportForm";
import { useTranslation } from "react-i18next";
import { enCustomLocale, jaCustomLocale } from "../config/CalendarLocalization";
import ReportBottomSheet from "./ReportBottomSheet";
import { useSelectedShift } from "../contexts/SelectedShiftProvider";

// interface State {
//   items?: AgendaSchedule;
// }

interface CalendarViewProps {
  // submitShiftReport: (values: ShiftReport) => void;
  shifts: ShiftSchedule[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  // submitShiftReport,
  selectedDate,
  setSelectedDate,
  shifts,
}) => {
  const { t, i18n } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "yyyy-MM")
  );

  const [isBottomSheetVisible, setIsBottomSheetVisible] =
    useState<boolean>(false);

  const { setSelectedShift } = useSelectedShift();

  const adjustedInitialDate = format(selectedDate, "yyyy-MM-dd", {
    locale: ja,
  });

  useEffect(() => {
    if (i18n.language === "en") {
      LocaleConfig.locales["en"] = enCustomLocale;
      LocaleConfig.defaultLocale = "en";
    } else if (i18n.language === "ja") {
      LocaleConfig.locales["ja"] = jaCustomLocale;
      LocaleConfig.defaultLocale = "ja";
    }
  }, [i18n, LocaleConfig]);

  const insets = useSafeAreaInsets();

  const headerHeight = useHeaderHeight();
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  // Convert shifts to the required agenda format
  const agendaFormattedShifts = useMemo(
    () => shiftToAgendaList(shifts),
    [shifts]
  );

  //for calendar marked dates (from shift dates)
  const marked = useRef(getMarkedDates(agendaFormattedShifts));

  // const agendaItems = useMemo(
  //   () => getAgendaList(agendaFormattedShifts),
  //   [agendaFormattedShifts]
  // );

  const getAgendaList = useCallback((agendaItems: AgendaItems) => {
    const result = [];
    for (let day = 1; day <= 31; day++) {
      const dateKey = `${currentMonth}-${day.toString().padStart(2, '0')}`;
      if (agendaItems[dateKey]) {
        result.push({
          title: dateKey,
          data: agendaItems[dateKey],
        });
      } else {
        // If there are no items for this date, add an empty entry
        result.push({
          title: dateKey,
          data: [],
        });
      }
    }
    return result;
  }, [currentMonth, agendaFormattedShifts]);
  
  const memoizedAgendaItems = useMemo(() => getAgendaList(agendaFormattedShifts), [getAgendaList, agendaFormattedShifts]);
  

  // const onDateChanged = useCallback((date, updateSource) => {
  //   console.log('ExpandableCalendarScreen onDateChanged: ', date, updateSource);
  // }, []);

  const onMonthChange = useCallback((date: DateData) => {
    // console.log('ExpandableCalendarScreen onMonthChange: ', dateString);
    const selectedMonth = date.dateString.substring(0, 7);
    setCurrentMonth(selectedMonth);
    // console.log(selectedMonth);
  }, []);

  // Function to open the bottom sheet
  const handleOpen = () => {
    setIsBottomSheetVisible(true);
  };

  const handleClose = () => {
    setIsBottomSheetVisible(false);
  };

  // data from shiftreport form (this is the submit handler drilled 2 times)
  // const submitShiftReportHandler = (values: ShiftReport) => {
  //   submitShiftReport(values);
  // };

  // Agendas
  const renderItem = useCallback(({ item }: { item: ShiftAgendaItem }) => {
    return (
      <CalendarItem
        item={item}
        // bottomSheetRef={bottomSheetRef}
        showRecords={useCallback(() => {
          // Alert.alert("Show me more");
          setSelectedShift({
            id: item.id,
            patient: item.title,
            start: item.start,
            end: item.end,
          } as ShiftSchedule);
          handleOpen();
        }, [])}
      />
    );
  }, []);

  // callbacks
  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log("handleSheetChanges", index);
  // }, []);

  return (
    <Fragment>
      <CalendarProvider
        date={adjustedInitialDate}
        // onDateChanged={onDateChanged}
        // onMonthChange={onMonthChange}
        // showTodayButton
        disabledOpacity={0.6}
        theme={todayBtnTheme.current}
        // todayBottomMargin={16}
      >
        <SafeAreaView
          style={[styles.calendarViewContainer, { marginTop: headerHeight }]}
        >
          {/* <ExpandableCalendar */}
          <Calendar
            // testID={testIDs.expandableCalendar.CONTAINER}
            // disableAllTouchEventsForDisabledDays
            // disableAllTouchEventsForInactiveDays
            // pagingEnabled={false} // Disable horizontal paging
            // hideExtraDays // Hide days from other months
            // hideArrows
            // disablePan
            // disableMonthChange
            onMonthChange={onMonthChange}
            enableSwipeMonths={true}
            // hideKnob
            // allowShadow
            // initialPosition={ExpandableCalendar.positions.OPEN}

            calendarStyle={styles.calendar}
            headerStyle={[styles.header, {}]} // for horizontal only
            // disableWeekScroll
            current={adjustedInitialDate}
            theme={theme.current}
            firstDay={1}
            markedDates={marked.current}
            leftArrowImageSource={leftArrowIcon}
            rightArrowImageSource={rightArrowIcon}
            // animateScroll
            // closeOnDayPress={false}
          />
          {/* )} */}
          <AgendaList
            sections={memoizedAgendaItems}
            renderItem={renderItem}
            // scrollToNextEvent
            // avoidDateUpdates
            sectionStyle={styles.section}
            markToday={true}
            // dayFormat={'yyyy-MM-d'}
          />
        </SafeAreaView>
      </CalendarProvider>
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

export default CalendarView;

const getDatesOfMonth = (year: number, month: number): Date[] => {
  const dates: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
};


function getMarkedDates(agendaItems: AgendaItems) {
  const marked: MarkedDates = {};

  // console.log(agendaItems);

  Object.keys(agendaItems).forEach((date) => {
    const itemsForDate = agendaItems[date];
    if (itemsForDate.length > 0) {
      marked[date] = { marked: true };
    } else {
      marked[date] = { disabled: true };
    }
  });

  return marked;
}

// Function to transform agendaFormattedShifts to the format expected by AgendaList
// const getAgendaList = (agendaItems: AgendaItems) => {
//   // console.log(agendaItems)
//   return Object.keys(agendaItems).map((date) => {
//     return {
//       title: date,
//       data: agendaItems[date],
//     };
//   });
// };

const shiftToAgendaList = (
  shifts: ShiftSchedule[]
): { [date: string]: ShiftAgendaItem[] } => {
  const agendaItems: { [date: string]: ShiftAgendaItem[] } = {};

  shifts.forEach((shift) => {
    // Extract date and time from the ISO string
    const startDate = shift.start.toString().split("T")[0]; // yyyy-MM-dd format
    const startTime = shift.start.toString().split("T")[1].substring(0, 5); // HH:mm format
    const endDate = shift.end.toString().split("T")[0]; // yyyy-MM-dd format
    let endTime = shift.end.toString().split("T")[1].substring(0, 5); // HH:mm format

    // If the end time is '00:00', adjust it to '24:00' and use the startDate
    if (endTime === "00:00") {
      endTime = "24:00";
    }

    if (shift.patient === "nan") {
      shift.patient = "";
    }

    // Initialize the array for the date if it doesn't exist
    if (!agendaItems[startDate]) {
      agendaItems[startDate] = [];
    }

    // Add the shift to the agenda
    agendaItems[startDate].push({
      id: shift.id,
      title: shift.patient || "", // Replacing 'nan' with an empty string
      summary: `${shift.service_type} - ${shift.service_details}`,
      start: startTime,
      end: endTime,
      duration: shift.duration,
      color: shift.color,
    });
  });

  return agendaItems;
};

const styles = StyleSheet.create({
  calendarViewContainer: {
    flex: 1,
  },
  calendar: {
    paddingLeft: 10,
    paddingRight: 10,
    // backgroundColor: lightThemeColor,
  },
  header: {
    backgroundColor: theme.colors.pink500,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  section: {
    backgroundColor: lightThemeColor,
    color: theme.colors.pink500,
    fontSize: 16,
    textTransform: "capitalize",
    // borderbottomWidth: 5,
    // borderBottomColor: theme.colors.pink400,

  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
