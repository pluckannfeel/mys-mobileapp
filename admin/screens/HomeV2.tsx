import React, {
  useLayoutEffect,
  useRef,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Fontisto,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { UserInfo } from "../../auth/types/userInfo";
import { LinearGradient } from "expo-linear-gradient";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { useNavigation, StackActions } from "@react-navigation/native";
import { AppNavigationProp } from "../../AppScreens";
import { HEIGHT } from "../../core/constants/dimensions";
import BottomSheet from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import PayslipScreen from "../../Payslip/screens/Payslip";
import ProfileScreen from "../../Profile/screens fix/Profile";
import { Profile } from "../../Profile/types/profile";
import QuickLinks from "../components/QuickLinks";
import LatestNewsWidget from "../../core/Components/LatestNewsWidget";
import BrandConcept from "../components/BrandConcept";
import { ScrollView } from "react-native-gesture-handler";
import { useGetRecentPosts } from "../hooks/usGetRecentPosts";
import { Post } from "../types/post";
import Loader from "../../core/Components/Loader";
import { useAuth } from "../../auth/contexts/AuthProvider";

const Tab = createBottomTabNavigator();

// Define a type for the icon props
type IconProps =
  | React.ComponentProps<typeof MaterialCommunityIcons>
  | React.ComponentProps<typeof MaterialIcons>
  | React.ComponentProps<typeof Fontisto>;

interface HomeProps {
  //   userInfo?: UserInfo;
  //   isUserDataLoading: boolean;
  //   recentPosts?: Post[];
  //   isRecentPostsLoading: boolean;
}

const HomeScreen: React.FC<HomeProps> = (
  {
    //   userInfo,
    //   recentPosts,
    //   isUserDataLoading,
    //   isRecentPostsLoading,
  }
) => {
  const { t } = useTranslation();
  const { recentPosts, isRecentPostsLoading, refetchRecentPosts } = useAuth();
  //   const navigation = useNavigation<AppNavigationProp>();
  //   useLayoutEffect(() => {
  //     navigation.setOptions({
  //       // title: t("admin.drawer.menu.home"),
  //       headerTitle: () => (
  //         <Image
  //           source={require("../../assets/images/newlogo.png")} // Replace with the path to your image
  //           style={{ width: 200, height: 26 }} // Adjust styling as needed
  //           resizeMode="contain" // or 'cover', 'stretch', etc.
  //         />
  //       ),
  //       headerTitleAlign: "center",
  //       headerTransparent: true,
  //     });
  //   }, []);

  return (
    <React.Fragment>
      <StatusBar style="dark" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView>
          <QuickLinks />

          <LatestNewsWidget
            data={recentPosts ?? []}
            loading={isRecentPostsLoading}
            refetch={refetchRecentPosts}
          />

          <Text style={styles.titlewDivider}>
            {t("admin.drawer.menu.other")}
          </Text>
          <BrandConcept />
        </ScrollView>

        {/* <View style={styles.container}></View> */}
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
  // quickLink: {
  //   // width: "48%", // approximately half the container width minus the space between
  //   // aspectRatio: 1, // square shape
  //   backgroundColor: "#fff",
  //   borderRadius: 8,
  //   padding: 20,
  //   alignItems: "center",
  //   justifyContent: "center", // Center icon and text vertically
  //   marginBottom: 20,
  //   // Box shadow styles for iOS
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  //   overflow: "hidden", // Ensures the gradient does not bleed outside the border radius
  // },
  icon: {
    marginBottom: 8,
  },
  quickLinkTouchable: {
    width: "48%", // Adjust as necessary
    aspectRatio: 1.5, // Keeps it square
    borderRadius: 8,
    overflow: "hidden", // Ensures the touch response respects the borderRadius
    marginBottom: 20, // Spacing between items
  },
  quickLinkGradient: {
    flex: 1,
    justifyContent: "center", // Center contents vertically
    alignItems: "center", // Center contents horizontally
    borderRadius: 8, // Match the touchable's borderRadius
    padding: 20, // Inner padding
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
  titlewDivider: {
    fontSize: 22,
    // fontVariant
    fontWeight: "bold",
    paddingHorizontal: 16,
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
    marginBottom: 10,
  },
});
