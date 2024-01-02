import React, { useLayoutEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerItem,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./Home";
import { UserInfo } from "../../auth/types/userInfo";
import { useAuth } from "../../auth/contexts/AuthProvider";
import ShiftScreen from "../../Shift/screens/Shift";

import { useNavigation, StackActions } from "@react-navigation/native";
import { AppNavigationProp } from "../../AppScreens";
import PayslipScreen from "../../Payslip/screens/Payslip";
import DocumentScreen from "../../Document/screens/Document";
import ProfileScreen from "../../Profile/screens/Profile";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { height } from "../../core/constants/dimensions";
import { useTheme } from "../../core/contexts/ThemeProvider";
import { useTranslation } from "react-i18next";
import LeaveRequestsScreen from "../../Shift/screens/LeaveRequests";
import LeaveRequestBottomSheet from "../../Shift/Components/LeaveRequestBottomSheet";
import { Profile } from "../../Profile/types/profile";

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { userInfo, logout } = useAuth();
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
  const { userInfo } = useAuth();
  const navigation = useNavigation<AppNavigationProp>();
  const theme = useTheme();
  const { t } = useTranslation();

  useLayoutEffect(() => {
    // Set the navigation header title
    navigation.setOptions({
      // title: "Home",
      headtransparent: true,
    });
  }, [navigation]);

  const HomeScreenWrapper = () => {
    return <HomeScreen userInfo={userInfo as UserInfo} />;
  };

  const ProfileScreenWrapper = () => {
    return <ProfileScreen userInfo={{ ...userInfo } as Profile} />;
  };

  const ShiftScreenWrapper = () => {
    return <ShiftScreen userInfo={userInfo as UserInfo} />;
  };

  const LeaveRequestScreenWrapper = () => {
    return <LeaveRequestsScreen userInfo={userInfo as UserInfo} />;
  };

  const PayslipScreenWrapper = () => {
    return <PayslipScreen userInfo={userInfo as UserInfo} />;
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
        }}
      />
      <Drawer.Screen
        name="Shift"
        component={React.memo(ShiftScreenWrapper)}
        options={{ drawerLabel: t("admin.drawer.menu.shift") }}
      />
      <Drawer.Screen
        name="LeaveRequests"
        component={React.memo(LeaveRequestScreenWrapper)}
        options={{
          drawerLabel: t("admin.drawer.menu.leaveRequests"),
          headerTitle: t("admin.drawer.menu.leaveRequests"),
        }}
      />
      <Drawer.Screen
        name="Payslip"
        component={React.memo(PayslipScreenWrapper)}
        options={{ drawerLabel: t("admin.drawer.menu.payslip") }}
      />
      <Drawer.Screen
        name="Document"
        component={React.memo(DocumentScreen)}
        options={{ drawerLabel: t("admin.drawer.menu.document") }}
      />
      <Drawer.Screen
        name="Profile"
        component={React.memo(ProfileScreenWrapper)}
        options={{ drawerLabel: t("admin.drawer.menu.profile") }}
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
    backgroundColor: "#fb7185",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    // This will truncate the text with an ellipsis if it's too long
    overflow: "hidden",
  },
  userEmail: {
    fontSize: 14,
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
    bottom: 0, // Anchor to the bottom
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
