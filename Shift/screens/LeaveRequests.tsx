import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TextStyle,
  RefreshControl,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { format } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import i18n from "../../core/config/i18n";
import { useNavigation, StackActions } from "@react-navigation/native";
import { AppNavigationProp } from "../../AppScreens";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme/theme";
import { useHeaderHeight } from "@react-navigation/elements";
import LeaveRequestBottomSheet from "../Components/LeaveRequestBottomSheet";
import { useStaffLeaveRequests } from "../hooks/useStaffLeaveRequests";
import { UserInfo } from "../../auth/types/userInfo";
import Loader from "../../core/Components/Loader";
import { ScrollView } from "react-native-gesture-handler";

export interface LeaveRequest {
  id: string;
  start_date: Date;
  end_date: Date;
  type: string;
  number_of_days: number;
  status: "pending" | "approved" | "declined";
  details: string;
}

type LeaveRequestScreenProps = {
  userInfo: UserInfo;
};

const formatDate = (date: Date, locale: "en-US" | "ja-JP") => {
  const formatString = "EEE, MMM d";
  const localeObject = locale === "en-US" ? enUS : ja;
  return format(new Date(date), formatString, { locale: localeObject });
};

const dataGroupedByMonth = (
  leaveRequests: LeaveRequest[],
  current_locale: Locale
): Record<string, LeaveRequest[]> => {
  return leaveRequests.reduce((acc, leaveRequest) => {
    // Extract the month and year from the start date
    const month = format(new Date(leaveRequest.start_date), "MMMM yyyy", {
      locale: current_locale,
    });
    // Initialize the group if it doesn't exist
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(leaveRequest);
    return acc;
  }, {} as Record<string, LeaveRequest[]>);
};

const LeaveRequestsScreen: React.FC<LeaveRequestScreenProps> = ({
  userInfo,
}) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<AppNavigationProp>();
  const headerHeight = useHeaderHeight();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [
    isRequestLeaveBottomSheetVisible,
    setIsRequestLeaveBottomSheetVisible,
  ] = useState<boolean>(false);

  // data
  const {
    isLoading,
    data: leaveRequests,
    refetch: refetchLeaveRequests,
  } = useStaffLeaveRequests(userInfo.staff_code);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your data fetching logic here.
      await refetchLeaveRequests();
    } catch (error) {
      // console.error("Error refreshing leave requests", error);
      Alert.alert("Error refreshing leave requests");
    } finally {
      // Wait for 3 seconds before setting refreshing to false
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [refetchLeaveRequests]);

  // header options
  useLayoutEffect(() => {
    // if (!isLoading) {
    navigation.setOptions(
      {
        // title: t("admin.drawer.menu.leaveRequests"),
        // headerTitle: t("admin.drawer.menu.leaveRequests"),
        // headerTransparent: true,
        // // headerTintColor: "#fff",
        // // headerTitleAlign: "left",

        // headerTitleStyle: {
        //   fontWeight: "bold",
        //   fontSize: 24,
        // },

        headerRight: () => (
          <View style={{ flexDirection: "row", paddingRight: 5 }}>
            <MaterialIcons
              name={"post-add"}
              size={25}
              color={theme.colors.primary}
              style={{ marginRight: 10 }}
              onPress={() => setIsRequestLeaveBottomSheetVisible(true)}
            />
          </View>
        ),
      }
      //   });
    );
  }, [navigation]);

  const sortedAndGroupedLeaveRequests = React.useMemo(() => {
    if (!leaveRequests) {
      // If leaveRequests is undefined, return an empty object
      return {};
    }
    // Now we know leaveRequests is defined, continue as before
    const sortedLeaveRequests = [...(leaveRequests || [])].sort((a, b) => {
      // Ensure both start_date values are Date objects
      const startDateA = new Date(a.start_date);
      const startDateB = new Date(b.start_date);
      return startDateA.getTime() - startDateB.getTime();
    });
    return dataGroupedByMonth(
      sortedLeaveRequests as LeaveRequest[],
      i18n.language === "ja" ? ja : enUS
    );
  }, [leaveRequests]);

  const renderGroupedItems = () => {
    return Object.entries(sortedAndGroupedLeaveRequests).length > 0 ? (
      Object.entries(sortedAndGroupedLeaveRequests).map(([month, requests]) => (
        <View key={month} style={{ marginBottom: 20 }}>
          <Text style={styles.monthHeader}>{month}</Text>
          {requests.map((request) => {
            const locale = i18n.language === "ja" ? "ja-JP" : "en-US";

            const leave_type =
              request.type === "paid"
                ? t("leaveRequest.screen.row.type.paid")
                : t("leaveRequest.screen.row.type.unpaid");

            const status =
              request.status === "pending"
                ? t("leaveRequest.screen.row.status.pending")
                : request.status === "approved"
                ? t("leaveRequest.screen.row.status.approved")
                : t("leaveRequest.screen.row.status.declined");

            return (
              <View key={request.id} style={styles.requestRow}>
                <View style={styles.dateColumn}>
                  <Text style={styles.dateLabel}>
                    {t("leaveRequest.screen.row.from")}
                  </Text>
                  <Text style={styles.dateText}>
                    {formatDate(request.start_date, locale)}
                  </Text>
                  <Text style={styles.dateLabel}>
                    {t("leaveRequest.screen.row.until")}
                  </Text>
                  <Text style={styles.dateText}>
                    {formatDate(request.end_date, locale)}
                  </Text>
                </View>
                <Text style={styles.typeText}>{`${leave_type} (${
                  request.number_of_days ? request.number_of_days : "0"
                })`}</Text>
                <Text style={getStatusStyle(request.status)}>{status}</Text>
              </View>
            );
          })}
        </View>
      ))
    ) : (
      <Text style={styles.emptyState}>{t("leaveRequest.screen.empty")}</Text>
    );
  };

  //   const renderItem = ({ item }: { item: LeaveRequest }) => {
  //     const locale = i18n.language === "ja" ? "ja-JP" : "en-US";

  //     const startDateFormatted = formatDate(item.start_date, locale); // or 'ja-JP' for Japanese
  //     const endDateFormatted = formatDate(item.end_date, locale); // same here

  //     const leave_type =
  //       item.type === "paid"
  //         ? t("leaveRequest.screen.row.type.paid")
  //         : t("leaveRequest.screen.row.type.unpaid");

  //     const status =
  //       item.status === "pending"
  //         ? t("leaveRequest.screen.row.status.pending")
  //         : item.status === "approved"
  //         ? t("leaveRequest.screen.row.status.approved")
  //         : t("leaveRequest.screen.row.status.declined");

  //     return (
  //       <View style={styles.requestRow}>
  //         <View style={styles.dateColumn}>
  //           <Text style={styles.dateLabel}>
  //             {t("leaveRequest.screen.row.from")}
  //           </Text>
  //           <Text style={styles.dateText}>{startDateFormatted}</Text>
  //           <Text style={styles.dateLabel}>
  //             {t("leaveRequest.screen.row.until")}
  //           </Text>
  //           <Text style={styles.dateText}>{endDateFormatted}</Text>
  //         </View>
  //         <Text style={styles.typeText}>{leave_type}</Text>
  //         <Text style={getStatusStyle(item.status)}>{status}</Text>
  //       </View>
  //     );
  //   };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <SafeAreaView
        style={[styles.container, { marginTop: headerHeight + 10 }]}
      >
        <StatusBar style="dark" />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.requestHeader}>
            <Text style={styles.dateColumnHeader}>
              {t("leaveRequest.screen.header.date")}
            </Text>
            <Text style={styles.dateColumnHeader}>
              {t("leaveRequest.screen.header.type")}
            </Text>
            <Text style={styles.dateColumnHeader}>
              {t("leaveRequest.screen.header.status")}
            </Text>
          </View>

          {renderGroupedItems()}
        </ScrollView>

        {/* <FlatList
      data={leaveRequests as LeaveRequest[]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    /> */}
      </SafeAreaView>
      {isRequestLeaveBottomSheetVisible && (
        <LeaveRequestBottomSheet
          isVisible={isRequestLeaveBottomSheetVisible}
          onClose={() => setIsRequestLeaveBottomSheetVisible(false)}
        />
      )}
    </>
  );
};

export default LeaveRequestsScreen;

const getStatusStyle = (status: string): TextStyle => {
  // Convert status to lowercase to ensure consistent comparison
  const normalizedStatus = status.toLowerCase();

  return {
    fontSize: 16,
    fontWeight: "bold",
    color:
      normalizedStatus === "pending"
        ? "orange"
        : normalizedStatus === "approved"
        ? "green"
        : "red",
    borderRadius: 10,
    overflow: "hidden",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor:
      normalizedStatus === "pending"
        ? "#FFF3E0"
        : normalizedStatus === "approved"
        ? "#E8F5E9"
        : "#FFEBEE",
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  requestHeader: {
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestRow: {
    // margin: 20,
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateColumnHeader: {
    // Adjust according to your layout
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  dateColumn: {
    // flex: 1
    // textAlign: "right"
    justifyContent: "center",
  },
  dateLabel: {
    fontSize: 16,
    color: "#333333",
  },
  dateText: {
    fontSize: 18,
    color: "#333333",
    // marginLeft: 5,
    marginVertical: 5,
    fontWeight: "bold",
  },
  typeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    // marginBottom: 5,
    marginLeft: 20,
  },
  emptyState: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
