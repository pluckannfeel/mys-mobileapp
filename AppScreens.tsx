import React, { useEffect, useLayoutEffect } from "react";
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
  StackActions,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "./auth/contexts/AuthProvider";

import LoginScreen from "./auth/screens/Login";
import ShiftScreen from "./Shift/screens/Shift";
import SettingsScreen from "./Settings/screens/Settings";
import HomeQuickActionsScreen from "./admin/screens/Home";
import { UserInfo } from "./auth/types/userInfo";
import MainScreen from "./admin/screens/MainDrawer";
import GeneralSettingsScreen from "./Settings/Components/General";
import { useTranslation } from "react-i18next";
import LeaveRequestsScreen from "./Shift/screens/LeaveRequests";
import NotificationsScreen from "./Notifications/screens/Notifications";
import { useWebSocket } from "./Notifications/contexts/WebSocketProvider";
import { useRegisterDeviceToken } from "./Notifications/hooks/useRegisterDeviceToken";
import {
  DeviceToken,
  NotificationParams,
} from "./Notifications/types/Notification";
import { usePushNotifications } from "./Notifications/hooks/usePushNotifications";
import { Alert } from "react-native";
import NotificationSettingsScreen from "./Settings/Components/NotificationSettings";

// Define the root stack params
export type RootStackParamList = {
  Private: undefined;
  Login: undefined;
};

// Define the private stack params
export type PrivateStackParamList = {
  Main: undefined;
  Shift: undefined;
  Settings: undefined;
  GeneralSettings: undefined;
  LeaveRequests: undefined;
  Notifications: undefined;
  NotificationSettings: undefined;
  // ... other private screens ...
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const PrivateStack = createNativeStackNavigator<PrivateStackParamList>();

// Type the navigation prop based on the stack param list
export type AppNavigationProp = NavigationProp<
  Record<string, object | undefined>
>;

// Define your PrivateStackScreen as a component that renders a navigator
const PrivateStackScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { t } = useTranslation();

  const { isLoggingOut, logout, userInfo } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
        navigation.dispatch(StackActions.replace("Login"));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function SettingsScreenWrapper() {
    return <SettingsScreen onLogout={handleLogout} />;
  }

  function LeaveRequestsScreenWrapper() {
    return <LeaveRequestsScreen userInfo={userInfo as UserInfo} />;
  }

  return (
    <PrivateStack.Navigator>
      <PrivateStack.Screen
        name="Main"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <PrivateStack.Screen
        name="Settings"
        component={SettingsScreenWrapper}
        options={{
          headerTitle: t("admin.drawer.menu.settings"),
        }}
      />

      <PrivateStack.Screen
        name="GeneralSettings"
        component={GeneralSettingsScreen}
        options={{
          headerTitle: t("admin.drawer.menu.settings"),
        }}
      />
      <PrivateStack.Screen
        name="NotificationSettings"
        component={NotificationSettingsScreen}
        options={{
          headerTitle: t("admin.drawer.menu.settings"),
        }}
      />
      <PrivateStack.Screen
        name="LeaveRequests"
        component={LeaveRequestsScreenWrapper}
        options={{
          headerTitle: t("admin.drawer.menu.settings"),
        }}
      />
      <PrivateStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          headerTitle: t("admin.drawer.menu.notifications"),
        }}
      />
      {/* <PrivateStack.Screen name="Shift" component={ShiftScreen} /> */}

      {/* ... other private screens ... */}
    </PrivateStack.Navigator>
  );
};

const AppScreens = () => {
  const { userInfo } = useAuth();

  // register the device token here
  // const { deviceToken } = useWebSocket();

  const { expoPushToken } = usePushNotifications();

  const { isRegistering, registerDeviceToken } = useRegisterDeviceToken();

  useEffect(() => {
    if (expoPushToken && userInfo) {
      // console.log(expoPushToken);
      // console.log(userInfo);
      registerDeviceToken({
        token: expoPushToken.data,
        staff_code: userInfo.staff_code,
      } as DeviceToken).then((data) => {
        // console.log("device token saved ");
      });
    }
  }, [expoPushToken, userInfo]);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {userInfo ? (
          // If the user is logged in, show the PrivateStack
          <RootStack.Screen name="Private" component={PrivateStackScreen} />
        ) : (
          // If not logged in, show the LoginScreen
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppScreens;
