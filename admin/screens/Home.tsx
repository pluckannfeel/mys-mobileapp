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

import { useNavigation, StackActions } from "@react-navigation/native";
import { AppNavigationProp } from "../../AppScreens";
import { HEIGHT } from "../../core/constants/dimensions";

import BottomSheet from "@gorhom/bottom-sheet";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
// import WeatherWidget from "../../core/Components/WeatherWidget";
import { useUpcomingShift } from "../../Shift/hooks/useUpcomingShift";
import UpcomingShift from "../../Shift/Components/UpcomingShift";

// Define a type for the icon props
type IconProps =
  | React.ComponentProps<typeof MaterialCommunityIcons>
  | React.ComponentProps<typeof MaterialIcons>
  | React.ComponentProps<typeof Fontisto>;

// QuickLinkProps now accepts a generic type for the icon component and its props
interface QuickLinkProps {
  // Icon: React.ElementType<IconProps>; // ElementType allows passing of component types
  // iconProps: IconProps; // The props for the icon component
  Icon: React.ElementType; // Accept any component
  iconProps: Record<string, any>; // Accept any props for the icon component
  title: string;
  isNew?: boolean;
  backgroundColor: string;
  onPress?: () => void;
}

const lightenDarkenColor = (color: string, amount: number): string => {
  let usePound = false;

  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);
  let r = (num >> 16) + amount;
  let b = ((num >> 8) & 0x00ff) + amount;
  let g = (num & 0x0000ff) + amount;

  r = Math.min(Math.max(0, r), 255);
  b = Math.min(Math.max(0, b), 255);
  g = Math.min(Math.max(0, g), 255);

  return (
    (usePound ? "#" : "") +
    ((r << 16) | (b << 8) | g).toString(16).padStart(6, "0")
  );
};

const generateGradientColors = (color: string): string[] => {
  return [lightenDarkenColor(color, -30), color, lightenDarkenColor(color, 30)];
};

const QuickLink: React.FC<QuickLinkProps> = ({
  Icon,
  iconProps,
  title,
  isNew,
  backgroundColor,
  onPress,
}) => {
  // Gradient colors
  // const gradientColors = ["#ffafbd", "#ffc3a0"]; // Example colors/
  const gradientColors = useMemo(
    () => generateGradientColors(backgroundColor),
    [backgroundColor]
  );

  return (
    <TouchableOpacity onPress={onPress} style={styles.quickLinkTouchable}>
      <LinearGradient
        colors={gradientColors}
        style={styles.quickLinkGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Icon {...iconProps} />
        <Text style={styles.quickLinkText}>{title}</Text>
      </LinearGradient>
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

  const navigation = useNavigation<AppNavigationProp>();
  useLayoutEffect(() => {
    if (!isInitialized) {
      // Set the navigation header title
      navigation.setOptions({
        // title: t("admin.drawer.menu.home"),
        headerTitle: () => (
          <Image
            source={require("../../assets/images/newlogo.png")} // Replace with the path to your image
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

  const snapPoints =
    Platform.OS === "ios" ? ["12", "24%", "57%"] : ["12", "24%", "64%"];

  return (
    <React.Fragment>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {isInitialized && (
            <>
              {/* <WeatherWidget /> */}
              {/* <UpcomingShift userInfo={userInfo} /> */}
            </>
          )}
        </View>

        <BottomSheet
          ref={quickLinksBottomSheet}
          snapPoints={useMemo(() => snapPoints, [])} // Define snap points
          index={2} // Set the initial index corresponding to '0%' to keep it closed
        >
          <View style={styles.quickLinksWrapper}>
            <View style={styles.quickLinksContainer}>
              {/* <QuickLink
                Icon={MaterialCommunityIcons}
                iconProps={{
                  name: "calendar-clock-outline",
                  size: 26,
                  color: "white",
                }}
                title={t("admin.drawer.menu.shift")}
                backgroundColor="#fb7185"
                onPress={() => navigation.navigate("Shift")}
              /> */}

              <QuickLink
                Icon={Ionicons}
                iconProps={{
                  name: "wallet",
                  size: 26,
                  color: "white",
                }}
                title={t("admin.drawer.menu.payslip")}
                backgroundColor="#22c55e"
                onPress={() => navigation.navigate("Payslip")}
              />

              <QuickLink
                Icon={MaterialCommunityIcons}
                iconProps={{
                  name: "account-circle",
                  size: 26,
                  color: "white",
                }}
                title={t("admin.drawer.menu.profile")}
                backgroundColor="#0284c7"
                onPress={() => navigation.navigate("Profile")}
              />

              <QuickLink
                Icon={FontAwesome5}
                iconProps={{
                  name: "money-check-alt",
                  size: 20,
                  color: "white",
                }}
                title={t("admin.drawer.menu.taxcertificate")}
                backgroundColor="#B31B1B"
                onPress={() => navigation.navigate("Taxcertificate")}
              />

              <QuickLink
                Icon={MaterialCommunityIcons}
                iconProps={{
                  name: "license",
                  size: 26,
                  color: "white",
                }}
                title={t("admin.drawer.menu.licenses")}
                backgroundColor="#FF7A00"
                onPress={() => navigation.navigate("License")}
              />

              <QuickLink
                Icon={Fontisto}
                iconProps={{
                  name: "asterisk",
                  size: 26,
                  color: "white",
                }}
                title={t("admin.drawer.menu.emergencyContact")}
                backgroundColor="#495057"
                onPress={() => navigation.navigate("EmergencyContact")}
              />

              {/* <QuickLink
                Icon={MaterialCommunityIcons}
                iconProps={{
                  name: "file-document",
                  size: 26,
                  color: "white",
                }}
                title={t("admin.drawer.menu.document")}
                backgroundColor="#ef4444"
                onPress={() => navigation.navigate("Document")}
              /> */}
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
});
