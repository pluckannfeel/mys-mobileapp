import React, {
  useLayoutEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
} from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { UserInfo } from "../../auth/types/userInfo";

import { useNavigation, StackActions } from "@react-navigation/native";
import { AppNavigationProp } from "../../AppScreens";
import { HEIGHT } from "../../core/constants/dimensions";

import BottomSheet from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import WeatherWidget from "../../core/Components/WeatherWidget";
import { useUpcomingShift } from "../../Shift/hooks/useUpcomingShift";
import UpcomingShift from "../../Shift/Components/UpcomingShift";

type QuickLinkProps = {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  title: string;
  isNew?: boolean;
  backgroundColor?: string;
  onPress?: () => void;
};

const QuickLink: React.FC<QuickLinkProps> = ({
  iconName,
  title,
  isNew,
  onPress,
  backgroundColor,
}) => {
  return (
    <TouchableOpacity
      style={[styles.quickLink, { backgroundColor }]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={iconName}
        style={styles.icon}
        size={26}
        color="white"
      />
      {/* {isNew && <View style={styles.newBadge}><Text>NEW</Text></View>} */}
      <Text style={styles.quickLinkText}>{title}</Text>
    </TouchableOpacity>
  );
};

interface HomeProps {
  userInfo: UserInfo;
}

const HomeScreen: React.FC<HomeProps> = ({ userInfo }) => {
  // form for reports/ record
  const [isInitialized, setIsInitialized] = useState(false);

  const quickLinksBottomSheet = useRef<BottomSheet>(null);

  const { t } = useTranslation();

  // upcoming shift data
  // const { data: upcomingShift } = useUpcomingShift(
  //   userInfo.japanese_name as string
  // );

  const navigation = useNavigation<AppNavigationProp>();
  useLayoutEffect(() => {
    if (!isInitialized) {
      // Set the navigation header title
      navigation.setOptions({
        // title: t("admin.drawer.menu.home"),
        headerTitle: () => (
          <Image
            source={require("../../assets/images/headerlogo.png")} // Replace with the path to your image
            style={{ width: 200, height: 26 }} // Adjust styling as needed
            resizeMode="contain" // or 'cover', 'stretch', etc.
          />
        ),
        headerTitleAlign: "center",
        headerTransparent: true,
      });
    }

    setIsInitialized(true);
  }, [navigation, isInitialized]);

  const snapPoints = Platform.OS === 'ios' ? ["12", "24%", "45%"] : ["12", "24%", "50%"];

  return (
    <React.Fragment>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* <Text style={styles.greeting}>Hi, {userInfo.japanese_name}</Text> */}
          {/* Quick links should only take the space they need, hence the use of flex: 0 */}

          <WeatherWidget />

          {/* // TODO: the data fetching is making the crash app here, put the data fetching in the component instead later */}
          {/* {upcomingShift && <UpcomingShift shift={upcomingShift} />} */}
        </View>

        <BottomSheet
          ref={quickLinksBottomSheet}
          // detached={true}
          snapPoints={useMemo(() => snapPoints, [])} // Define snap points
          index={2} // Set the initial index corresponding to '0%' to keep it closed
          // renderContent={renderContent}
          // enabledGestureInteraction={true}
        >
          {/* <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text>Bottom Sheet Content</Text>
        </View> */}
          <View style={styles.quickLinksWrapper}>
            <View style={styles.quickLinksContainer}>
              <QuickLink
                iconName="calendar-clock-outline"
                title={t("admin.drawer.menu.shift")}
                backgroundColor="#fb7185"
                onPress={() => navigation.navigate("Shift")}
              />
              <QuickLink
                iconName="credit-card"
                backgroundColor="#22c55e"
                title={t("admin.drawer.menu.payslip")}
                onPress={() => navigation.navigate("Payslip")}
              />
              <QuickLink
                iconName="file-document"
                backgroundColor="#ef4444"
                title={t("admin.drawer.menu.document")}
                onPress={() => navigation.navigate("Document")}
              />
              <QuickLink
                iconName="account-circle"
                backgroundColor="#0284c7"
                title={t("admin.drawer.menu.profile")}
                isNew
                onPress={() => navigation.navigate("Profile")}
              />
            </View>
          </View>
        </BottomSheet>
      </SafeAreaView>
    </React.Fragment>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop: HEIGHT * 0.06,
    // backgroundColor: '#fff', // Set the background color to match your app's theme
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between", // Add this to space out the greeting and the links
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    // marginTop: 20,
    // marginLeft: 20,
    marginHorizontal: 20,
  },
  quickLinksWrapper: {
    // Setting flex to 0 ensures that this view does not grow
    flex: 0.45,
    // borderTopWidth: 1,
    // borderColor: "#ddd",
    // backgroundColor: "#fff",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: -2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    elevation: 10, // For Android shadow
    paddingTop: 10,
    paddingHorizontal: 20,
    // Removed paddingBottom to reduce space at the bottom
  },

  quickLinksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Add this to space out the links evenly
    // Adjust marginBottom to control space at the bottom of the container
    // marginBottom: 10,
  },
  quickLink: {
    width: "48%", // approximately half the container width minus the space between
    aspectRatio: 1, // square shape
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center", // Center icon and text vertically
    marginBottom: 20,
    // Box shadow styles for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginBottom: 8,
  },
  quickLinkText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white", // Set the text color to white
    textAlign: "center",
    // textShadowColor: 'rgba(0, 0, 0, 0.75)', // Adding shadow to text for readability
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  newBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "red",
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
});
