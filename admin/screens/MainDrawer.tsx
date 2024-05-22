import React, { lazy, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerItem,
} from "@react-navigation/drawer";
import { StackActions, useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../core/contexts/ThemeProvider";
import { theme } from "../../core/theme/theme";
import { useTranslation } from "react-i18next";
import { height } from "../../core/constants/dimensions";

import { AppNavigationProp } from "../../AppScreens";
import { UserInfo } from "../../auth/types/userInfo";
import { useAuth } from "../../auth/contexts/AuthProvider";
import { Profile } from "../../Profile/types/profile";
import { NotificationParams } from "../../Notifications/types/Notification";

// import { useWebSocket } from "../../Notifications/contexts/WebSocketProvider";
// import { useRegisterDeviceToken } from "../../Notifications/hooks/useRegisterDeviceToken";
import { usePushNotifications } from "../../Notifications/hooks/usePushNotifications";

import DocumentScreen from "../../Document/screens/Document";
import ProfileScreen from "../../Profile/screens/Profile";
// import HomeScreen from "./Home";
import HomeScreen from "./HomeV2";
// import ShiftScreen from "../../Shift/screens/Shift";
import LeaveRequestsScreen from "../../Shift/screens/LeaveRequests";
import EmergencyContactScreen from "../../Emergency_Contact/screens/EmergencyContacts";
import LicenseScreen from "../../Licenses/screens/License";
import TaxcertificateScreen from "../../Payslip/screens/Taxcertificate";
import PayslipScreen from "../../Payslip/screens/Payslip";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Post } from "../types/post";
import Loader from "../../core/Components/Loader";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { isUserDataLoading, userInfo, logout } = useAuth();
  const navigation = useNavigation<AppNavigationProp>();
  const { t } = useTranslation();

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawerContent}
      contentContainerStyle={{ paddingBottom: height * 0.43 }}
    >
      <View style={styles.userInfoSection}>
        <View style={styles.userRow}>
          <Image source={{ uri: userInfo?.img_url }} style={styles.userImage} />
          <View style={styles.userInfoText}>
            <Text style={styles.userName}>{userInfo?.japanese_name}</Text>
            <Text style={styles.userEmail}>{userInfo?.staff_code}</Text>
          </View>
        </View>
        {/* <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>EDIT</Text>
        </TouchableOpacity> */}
      </View>

      <View style={styles.drawerItemContainer}>
        <DrawerItemList {...props} />
        {/* Add Settings Button */}
      </View>

      <View style={styles.bottomDrawerSection}>
        <DrawerItem
          label={t("admin.drawer.menu.settings")}
          onPress={() =>
            navigation.navigate("Private", {
              screen: "Settings",
            })
          }
          icon={({ color, size }) => (
            <MaterialCommunityIcons
              name="cog-outline"
              color={color}
              size={size}
            />
          )}
        />
        <DrawerItem
          label={t("admin.drawer.menu.logout")}
          onPress={() => {
            logout()
              .then(() => {
                navigation.dispatch(StackActions.replace("Login"));
              })
              .catch((err) => {
                console.log(err);
              });
          }}
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          )}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const Drawer = createDrawerNavigator();

const MainScreen = () => {
  const { isUserDataLoading, userInfo, refetchUserInfo } = useAuth();
  const navigation = useNavigation<AppNavigationProp>();
  const theme = useTheme();
  const { t } = useTranslation();

  // useLayoutEffect(() => {
  //   // Set the navigation header title
  //   navigation.setOptions({
  //     // title: "Home",
  //     headtransparent: true,
  //   });
  // }, [navigation]);

  const HomeScreenWrapper = () => {
    return (
      <HomeScreen
      // userInfo={userInfo as UserInfo}
      // recentPosts={recentPosts as Post[]}
      />
    );
  };

  const ProfileScreenWrapper = () => {
    return (
      <ProfileScreen
        userInfo={{ ...userInfo } as Profile}
        isDataLoading={isUserDataLoading}
        refetchUserInfo={refetchUserInfo as () => void}
      />
    );
  };

  // const ShiftScreenWrapper = () => {
  //   return <ShiftScreen userInfo={userInfo as UserInfo} />;
  // };

  const LeaveRequestScreenWrapper = () => {
    return <LeaveRequestsScreen userInfo={userInfo as UserInfo} />;
  };

  const PayslipScreenWrapper = () => {
    return <PayslipScreen userInfo={userInfo as UserInfo} />;
  };

  const TaxcertificateScreenWrapper = () => {
    return <TaxcertificateScreen userInfo={userInfo as UserInfo} />;
  };

  const EmergencyContactWrapper = () => {
    return <EmergencyContactScreen userInfo={userInfo as UserInfo} />;
  };

  // const DocumentScreenWrapper = () => {
  //   return <DocumentScreen userInfo={userInfo as UserInfo} />;
  // };

  const LicenseScreenWrapper = () => {
    return <LicenseScreen userInfo={userInfo as UserInfo} />;
  };

  return (
    <Drawer.Navigator
      screenOptions={{ headerTintColor: theme.colors.pink400 }}
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={React.memo(HomeScreenWrapper)}
        options={{
          drawerLabel: t("admin.drawer.menu.home"),
          headerRight: () => (
            <View style={{ flexDirection: "row", paddingRight: 5 }}>
              <Ionicons
                name={
                  // shiftViewType === "default"
                  //   ? "calendar-month-outline"
                  //   : "view-week"
                  "notifications"
                }
                size={25}
                color={theme.colors.pink400}
                style={{ marginRight: 15 }}
                onPress={() => {
                  navigation.navigate("Notifications");
                }}
              />
            </View>
          ),
          headerTitle: () => (
            <Image
              source={require("../../assets/images/newlogo.png")} // Replace with the path to your image
              style={{ width: 200, height: 26 }} // Adjust styling as needed
              resizeMode="contain" // or 'cover', 'stretch', etc.
            />
          ),
          headerTitleAlign: "center",
          headerTransparent: true,
        }}
      />
      {/* <Drawer.Screen
        name="Shift"
        component={React.memo(ShiftScreenWrapper)}
        options={{ drawerLabel: t("admin.drawer.menu.shift") }}
      /> */}
      <Drawer.Screen
        name="EmergencyContact"
        component={React.memo(EmergencyContactWrapper)}
        options={{
          // lazy: false,
          headerTransparent: true,
          drawerLabel: t("admin.drawer.menu.emergencyContact"),
          headerTitle: t("admin.drawer.menu.emergencyContact"),
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
      <Drawer.Screen
        name="LeaveRequests"
        component={React.memo(LeaveRequestScreenWrapper)}
        options={{
          // lazy: false,
          headerTransparent: true,
          drawerLabel: t("admin.drawer.menu.leaveRequests"),
          headerTitle: t("admin.drawer.menu.leaveRequests"),
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
      <Drawer.Screen
        name="Payslip"
        component={React.memo(PayslipScreenWrapper)}
        options={{
          // lazy: false,
          headerTransparent: true,
          drawerLabel: t("admin.drawer.menu.payslip"),
          headerTitle: t("admin.drawer.menu.payslip"),
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />

      <Drawer.Screen
        name="Taxcertificate"
        component={React.memo(TaxcertificateScreenWrapper)}
        options={{
          // lazy: false,
          headerTransparent: true,
          drawerLabel: t("admin.drawer.menu.taxcertificate"),
          headerTitle: t("admin.drawer.menu.taxcertificate"),
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
      {/* 
      <Drawer.Screen
        name="Document"
        component={React.memo(DocumentScreenWrapper)}
        options={{ headerTitle: t("admin.drawer.menu.document") }}
      /> */}

      <Drawer.Screen
        name="License"
        component={React.memo(LicenseScreenWrapper)}
        options={{
          // lazy: false,
          headerTransparent: true,
          drawerLabel: t("admin.drawer.menu.licenses"),
          headerTitle: t("admin.drawer.menu.licenses"),
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={React.memo(ProfileScreenWrapper)}
        // options={{
        //   headerTransparent: true,
        //   headerTitle: t("admin.drawer.menu.profile"),
        // }}
        options={{
          // lazy: false,
          headerTransparent: true,
          drawerLabel: t("admin.drawer.menu.profile"),
          headerTitle: t("admin.drawer.menu.profile"),
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 24,
          },
        }}
      />

      {/* Add other screens here as needed */}
    </Drawer.Navigator>
  );
};
export default MainScreen;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    padding: 18,
    backgroundColor: theme.colors.pink500,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    // Add any additional styling for the image if needed
  },
  userInfoText: {
    flex: 1, // Allows text to expand to the available space
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    // This will truncate the text with an ellipsis if it's too long
    overflow: "hidden",
  },
  userEmail: {
    fontSize: 16,
    color: "white",
  },
  editButton: {
    // Style for your edit button
    padding: 5,
    // borderWidth: 1,
    // borderColor: 'white',
    // borderRadius: 5,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  drawerItemContainer: {
    flex: 1,
  },
  bottomDrawerSection: {
    position: "absolute", // Position absolutely
    // bottom: 40, // Anchor to the bottom
    // get the bottom position from the bottom of the screen
    bottom: height * 0.05,
    width: "100%", // Make sure it spans the full width
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
    // paddingTop: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    marginLeft: 15,
  },
  // Add this to ensure the logout button is at the bottom
});
