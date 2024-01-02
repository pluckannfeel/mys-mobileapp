import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { useNavigation, StackActions } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { t } from "i18next";
import { theme } from "../../core/theme/theme";
import { AppNavigationProp } from "../../AppScreens";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../core/contexts/ThemeProvider";
import { Notification } from "../types/Notification";
import { formatDistanceToNow } from "date-fns";
import { useDateLocale } from "../../core/hooks/useDateLocale";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../../auth/contexts/AuthProvider";
import { notificationsLinks } from "../helpers/constants";

type Props = {};

// Mock data - in a real application, this data would come from a server or local state
// const notifications: Notification[] = [
//   {
//     id: "0eabdf3a-2cc3-4fbf-bbe4-80b8854de057",
//     code: "leaveRequest",
//     params: {
//       staff: {
//         english_name: "PADAYAO JARVIS MILLAN",
//         japanese_name: "パダヤオ　ジャービス　ミラン",
//       },
//       subject: "Leave Request Created",
//     },
//     unread: true,
//     created_at: new Date("2023-11-29T06:29:58.910895+00:00"),
//   },
//   // ... Add more items here
// ];

const NotificationsScreen = (props: Props) => {
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<AppNavigationProp>();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const locale = useDateLocale();
  const { userInfo } = useAuth();

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    isLoading,
    data: notifications,
    refetch: refetchNofications,
  } = useNotifications(userInfo?.staff_code as string);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your data fetching logic here.
      await refetchNofications();
    } catch (error) {
      console.error("Error refreshing notifications", error);
    } finally {
      // Wait for 3 seconds before setting refreshing to false
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [refetchNofications]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.dispatch(StackActions.pop());
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      ),
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
      },
    });
  }, [navigation]);

  const notificationTitle = (code: string, status: string) => {
    switch (code) {
      case `updateLeaveRequest`: {
        if (status === `approved`) {
          return `${t("leaveRequest.notifications.updateLeaveRequest")} ${t(
            "leaveRequest.notifications.approved"
          )} `;
        }

        if (status === `declined`) {
          return `${t("leaveRequest.notifications.updateLeaveRequest")} ${t(
            "leaveRequest.notifications.declined"
          )} `;
        }
      }
      default: {
        return `Notification From MYS`;
      }
    }
  };

  // Item renderer for FlatList
  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      onPress={() => {
        const screen = notificationsLinks(item.code);
        if (screen) {
          // navigation.goBack();
          // This will navigate to the existing screen within the drawer without adding a new one
          navigation.navigate("Main", {
            screen: "LeaveRequests",
          });
        }
      }}
      style={styles.itemContainer}
    >
      <Text style={styles.itemSubject}>
        {notificationTitle(item.code, item.params?.status as string)}
      </Text>
      <Text style={styles.itemDate}>
        {formatDistanceToNow(new Date(item.created_at), {
          addSuffix: true,
          locale,
        })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { marginTop: headerHeight + 10 }]}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    backgroundColor: "#FFF",
    marginBottom: 10,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  itemSubject: {
    fontWeight: "bold",
    fontSize: 16,
    color: theme.colors.primary,
  },
  itemDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});
