import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextStyle,
  RefreshControl,
  Alert,
  FlatList,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { format } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import i18n from "../../core/config/i18n";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme/theme";
import { useHeaderHeight } from "@react-navigation/elements";
import LeaveRequestBottomSheet from "../Components/LeaveRequestBottomSheet";
import { useStaffLeaveRequests } from "../hooks/useStaffLeaveRequests";
import { UserInfo } from "../../auth/types/userInfo";
import Loader from "../../core/Components/Loader";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useDeleteLeaveRequest } from "../hooks/useDeleteLeaveRequest";
import Toast from "react-native-toast-message";

// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export interface LeaveRequest {
  id: string;
  start_date: Date;
  end_date: Date;
  leave_type: string;
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

// ========= NAIN COMPONENT ===========
const LeaveRequestsScreen: React.FC<LeaveRequestScreenProps> = ({
  userInfo,
}) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const headerHeight = useHeaderHeight();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [
    isRequestLeaveBottomSheetVisible,
    setIsRequestLeaveBottomSheetVisible,
  ] = useState<boolean>(false);

  const [selectedLeaveRequest, setSelectedLeaveRequest] =
    useState<LeaveRequest | null>(null);

  const swipeableRef = useRef<Swipeable | null>(null);

  const { isDeleting, deleteLeaveRequest } = useDeleteLeaveRequest();

  const {
    isLoading,
    data: leaveRequests,
    refetch: refetchLeaveRequests,
  } = useStaffLeaveRequests(userInfo.staff_code);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchLeaveRequests();
    } catch (error) {
      Alert.alert("Error refreshing leave requests");
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [refetchLeaveRequests]);

  useLayoutEffect(() => {
    navigation.setOptions({
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
    });
  }, [navigation]);

  const groupedData = React.useMemo(() => {
    if (!leaveRequests) return [];
    const localeObject = i18n.language === "ja" ? ja : enUS;
    const result: Array<{ type: "header" | "item"; data: any }> = [];

    const grouped = leaveRequests.reduce((acc, leaveRequest) => {
      const month = format(new Date(leaveRequest.start_date), "MMMM yyyy", {
        locale: localeObject,
      });
      if (!acc[month]) acc[month] = [];
      acc[month].push(leaveRequest as LeaveRequest);
      return acc;
    }, {} as Record<string, LeaveRequest[]>);

    Object.entries(grouped).forEach(([month, requests]) => {
      result.push({ type: "header", data: month });
      requests.forEach((request) =>
        result.push({ type: "item", data: request })
      );
    });

    return result;
  }, [leaveRequests, i18n.language]);

  const renderRightActions = (leaveRequest: LeaveRequest) => (
    <View style={styles.actionsContainer}>
      {leaveRequest.status !== "approved" && (
        <>
          <Text
            style={styles.editAction}
            onPress={() => handleEdit(leaveRequest)}
          >
            {t("leaveRequest.actions.edit")}
          </Text>

          <Text
            style={styles.deleteAction}
            onPress={() => handleDelete(leaveRequest.id)}
          >
            {t("leaveRequest.actions.delete")}
          </Text>
        </>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: { type: string; data: any } }) => {
    if (item.type === "header") {
      return <Text style={styles.monthHeader}>{item.data}</Text>;
    }

    const request: LeaveRequest = item.data;
    const locale = i18n.language === "ja" ? "ja-JP" : "en-US";

    const leaveType =
      request.leave_type === "paid"
        ? t("leaveRequest.screen.row.type.paid")
        : t("leaveRequest.screen.row.type.unpaid");

    const status =
      request.status === "pending"
        ? t("leaveRequest.screen.row.status.pending")
        : request.status === "approved"
        ? t("leaveRequest.screen.row.status.approved")
        : t("leaveRequest.screen.row.status.declined");

    return (
      <Swipeable
        ref={(ref) => (swipeableRef.current = ref)}
        renderRightActions={() => renderRightActions(request as LeaveRequest)}
      >
        <View style={styles.requestRow}>
          <View style={styles.dateColumn}>
            <Text style={styles.dateText}>
              {t("leaveRequest.screen.row.from")}:{" "}
              {formatDate(request.start_date, locale)}
            </Text>
            <Text style={styles.dateText}>
              {t("leaveRequest.screen.row.until")}:{" "}
              {formatDate(request.end_date, locale)}
            </Text>
          </View>
          <Text style={styles.typeText}>
            {`${leaveType}`}
          </Text>
          <Text style={getStatusStyle(request.status)}>{status}</Text>
        </View>
      </Swipeable>
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      t("leaveRequest.alerts.delete.title"),
      t("leaveRequest.alerts.delete.message"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text:  t("leaveRequest.actions.delete"),
          onPress: () => {
            deleteLeaveRequest(id)
              .then((data) => {
                Toast.show({
                  type: "success",
                  text1: t("common.success"),
                  text2: t(
                    "leaveRequest.notifications.deleteSuccessLeaveRequest"
                  ),
                  visibilityTime: 4000,
                  topOffset: 60,
                });
              })
              .catch((error) => {
                Toast.show({
                  type: "error",
                  text1: t("common.error"),
                  text2: `${t(
                    "leaveRequest.notifications.errorLeaveRequest"
                  )}: ${error.response}`,
                  visibilityTime: 3000,
                  topOffset: 60,
                });

                // const detail = error.response.data.detail;
                // if (detail === "pending_leave_request") {
                //   Toast.show({
                //     type: "error",
                //     text1: t("common.error"),
                //     text2: t("leaveRequest.notifications.existingLeaveRequest"),
                //     visibilityTime: 8000,
                //     topOffset: 60,
                //   });
                // } else {

                // }
              })
              .finally(() => {
                swipeableRef.current?.close();
              });
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleEdit = (leaveRequest: LeaveRequest) => {
    setSelectedLeaveRequest(leaveRequest); // Set the selected leave request
    setIsRequestLeaveBottomSheetVisible(true); // Show the bottom sheet

    swipeableRef.current?.close();
  };

  return isLoading ? (
    <Loader />
  ) : (
    <SafeAreaView style={[styles.container, { marginTop: headerHeight + 10 }]}>
      <StatusBar style="dark" />
      <FlatList
        data={groupedData}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.type === "header"
            ? `header-${item.data}`
            : `item-${item.data.id}-${index}`
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {isRequestLeaveBottomSheetVisible && (
        <LeaveRequestBottomSheet
          leaveRequestData={selectedLeaveRequest as LeaveRequest}
          isVisible={isRequestLeaveBottomSheetVisible}
          onClose={() => setIsRequestLeaveBottomSheetVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default LeaveRequestsScreen;
// ========= NAIN COMPONENT ===========

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 20,
    color: "#333", // Darker color for contrast
  },
  requestRow: {
    borderRadius: 8,
    marginTop: 6,
    marginHorizontal: 10,
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  dateColumn: {
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
    fontWeight: "bold",
  },
  typeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden", // Ensures rounded corners
  },
  deleteAction: {
    backgroundColor: "#E6274F", // Match color in screenshot
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  editAction: {
    backgroundColor: "#FD9703", // Match color in screenshot
    color: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
});

const getStatusStyle = (status: string): TextStyle => {
  const normalizedStatus = status.toLowerCase();

  return {
    fontSize: 16,
    fontWeight: "bold",
    color: normalizedStatus === "approved" ? "#2E7D32" : "#FFA726",
    borderRadius: 10,
    overflow: "hidden",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: normalizedStatus === "approved" ? "#E8F5E9" : "#FFF3E0",
    alignSelf: "center",
  };
};
