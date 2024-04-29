import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Fragment, useState, useLayoutEffect, useMemo } from "react";
import { useNavigation, StackActions } from "@react-navigation/native";
import { format, parseISO, startOfDay } from "date-fns";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";

import { StatusBar } from "expo-status-bar";
import DefaultView from "../Components/DefaultView";
import CalendarView from "../Components/CalendarView";
import { useTheme } from "../../core/contexts/ThemeProvider";
import { AppNavigationProp } from "../../AppScreens";
import { useShifts } from "../hooks/useShifts";
import { ShiftReport, ShiftSchedule } from "../types/Shift";
import { UserInfo } from "../../auth/types/userInfo";
import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import Loader from "../../core/Components/Loader";
import { useTranslation } from "react-i18next";
import { ja } from "date-fns/locale";
import PopupMenu from "../../core/Components/PopupMenu";
import LeaveRequestBottomSheet from "../Components/LeaveRequestBottomSheet";

type ShiftScreenProps = {
  userInfo: UserInfo;
};

// const now = new Date();

// set todays date‰
// const today = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
const today = new Date();

type ScheduleViewType = "default" | "calendar";

const ShiftScreen: React.FC<ShiftScreenProps> = ({ userInfo }) => {
  const navigation = useNavigation<AppNavigationProp>();
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [shiftViewType, setViewType] = useState<ScheduleViewType>("default");
  const [selectedDate, setSelectedDate] = useState(today);

  // bottom sheet shift report form
  const [
    isRequestLeaveBottomSheetVisible,
    setIsRequestLeaveBottomSheetVisible,
  ] = useState<boolean>(false);

  // fetch shift data this month
  const { isLoading, data: shifts } = useShifts(userInfo.japanese_name);

  const processing = isLoading;

  const menuHandler = () => {
    // console.log(format(selectedDate, "yyyy-MM-dd"));

    setMenuVisible(true);

    // setViewType((prev) => {
    //   return prev === "default" ? "calendar" : "default";
    // });
  };

  const monthDay =
    i18n.language === "ja"
      ? format(selectedDate, "MMMM", { locale: ja })
      : format(selectedDate, "MMMM");

  const ShiftHeaderTitle = shiftViewType === "default" ? monthDay : "";

  // header options
  useLayoutEffect(() => {
    if (!isLoading) {
      navigation.setOptions({
        title: t("admin.drawer.menu.shift"),
        headerTitle: ShiftHeaderTitle,
        headerTransparent: true,
        // headerTintColor: "#fff",
        headerTitleAlign: "left",

        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 24,
        },

        headerRight: () => (
          <View style={{ flexDirection: "row", paddingRight: 5 }}>
            <MaterialCommunityIcons
              name={
                // shiftViewType === "default"
                //   ? "calendar-month-outline"
                //   : "view-week"
                "dots-vertical"
              }
              size={25}
              color={theme.colors.primary}
              style={{ marginRight: 10 }}
              onPress={menuHandler}
            />
          </View>
        ),
      });
    }
  }, [navigation, shiftViewType, selectedDate]);

  const menuOptions = useMemo(
    () => [
      {
        text: t("menu.listView"),
        onPress: () => {
          setViewType("default");
        },
      },
      {
        text: t("menu.calendarView"),
        onPress: () => {
          setViewType("calendar");
        },
      },
      {
        text: t("menu.dayOff"),
        onPress: () => {
          // setMenuVisible(false);
          // console.log("Request Day Off");
          setIsRequestLeaveBottomSheetVisible(true);
        },
      },
    ],
    []
  );

  return (
    <Fragment>
      <StatusBar style="dark" />

      {processing ? (
        <Loader />
      ) : shiftViewType === "default" ? (
        <DefaultView
          // this is submit from bottom sheet
          // submitShiftReport={submitReportHandler}
          shifts={shifts as ShiftSchedule[]}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      ) : (
        <CalendarView
          // this is submit from bottom sheet
          // submitShiftReport={submitReportHandler}
          shifts={shifts as ShiftSchedule[]}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      )}

      <PopupMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        menuOptions={menuOptions}
      />

      {/* {request leave} */}
      {isRequestLeaveBottomSheetVisible && (
        <LeaveRequestBottomSheet
          isVisible={isRequestLeaveBottomSheetVisible}
          onClose={() => setIsRequestLeaveBottomSheetVisible(false)}
        />
      )}
    </Fragment>
  );
};

export default ShiftScreen;

const styles = StyleSheet.create({});
