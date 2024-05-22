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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import NewsScreen from "../components/News";
import YourNotificationsScreen from "../components/YourNotifications";
import { ScrollView } from "react-native-gesture-handler";
import Loader from "../../core/Components/Loader";

const Tab = createMaterialTopTabNavigator();

type NotificationProps = {};

const NotificationsScreen = (props: NotificationProps) => {
  const navigation = useNavigation<AppNavigationProp>();
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerTransparent: true,
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
        fontSize: 22,
      },
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: false,
        tabBarIndicatorStyle: {
          backgroundColor: theme.colors.primary,
        },
        lazy: true,
        lazyPlaceholder: () => <Loader />,
        // tabBarActiveTintColor: "#e91e63",
        tabBarLabelStyle: { fontSize: 16, fontWeight: "bold" },
        tabBarStyle: {
          borderTopWidth: 0,
          shadowColor: "transparent",
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="YourNotifications"
        component={YourNotificationsScreen}
        options={{
          tabBarLabel: t("notificationsScreen.tabs.yourNotifications"),
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{ tabBarLabel: t("notificationsScreen.tabs.news") }}
      />
    </Tab.Navigator>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
