import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { useNavigation, StackActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { AppNavigationProp } from "../../AppScreens";
import InProgressView from "../../core/Components/InProgress";
import { data as lottieFiles } from "../../core/constants/lottieObjects";
import { useHeaderHeight } from "@react-navigation/elements";
import { UserInfo } from "../../auth/types/userInfo";
import { useLicenses } from "../hooks/useLicenses";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme/theme";
import Loader from "../../core/Components/Loader";
import { StatusBar } from "expo-status-bar";
import AddLicenseBottomSheet from "../component/AddLicenseBottomSheet";
import { format } from "date-fns";
import { enUS, ja } from "date-fns/locale";
import { License } from "../../Document/types/Document";

// import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";

type LicenseProps = {
  userInfo: UserInfo;
};

const formatDate = (date: Date, locale: "en-US" | "ja-JP") => {
  const formatString = "EEE, MMM d";
  const localeObject = locale === "en-US" ? enUS : ja;
  return format(new Date(date), formatString, { locale: localeObject });
};

// const LicenseItems = (licenses: License[]) => {
//   if (licenses.length === 0) {
//     return <Text style={styles.emptyState}>No licenses found</Text>;
//   }

//   return licenses.map((license, index) => {
//     return (
//       <View key={index} style={styles.licenseRow}>
//         <View style={styles.itemColumn}>
//           <Text style={styles.rowLabel}>Date</Text>
//           <Text style={styles.nameText}>
//             {formatDate(new Date(license.date), "en-US")}
//           </Text>
//         </View>
//         <View style={styles.itemColumn}>
//           <Text style={styles.rowLabel}>Name</Text>
//           <Text style={styles.typeText}>{license.name}</Text>
//           <Text style={styles.typeText}>{license.number}</Text>
//         </View>
//         <MaterialIcons
//           name="file-download"
//           size={30}
//           color={theme.colors.primary}
//         />
//       </View>
//     );
//   });
// };

const getExtension = (url: string) => {
  const match = /\.(\w+)$/.exec(url);
  return match ? match[1] : "";
};

const openFile = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Unable to open URL");
    }
  } catch (error) {
    console.error("An error occurred", error);
    Alert.alert("Error", "Failed to open URL");
  }
};

const shareFile = async (url: string) => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(url);
    } else {
      Alert.alert("Error", "Sharing is not available on this device");
    }
  } catch (error) {
    console.error("An error occurred", error);
    Alert.alert("Error", "Failed to share");
  }
};

// const downloadFile = async (url: string) => {
//   const fileName = url.split("/").pop() ?? "download"; // Fallback filename if none is found
//   const fileExtension = getExtension(url);

//   // Append an extension if one isn't present
//   const fullFileName = fileExtension ? fileName : `${fileName}.pdf`;

//   const fileUri = `${FileSystem.documentDirectory ?? ""}${fullFileName}`; // Fallback to empty string if documentDirectory is null

//   try {
//     const { uri: downloadedUri } = await FileSystem.downloadAsync(url, fileUri);
//     Alert.alert(
//       "Download Complete",
//       `File has been saved to: ${downloadedUri}`
//     );
//   } catch (error) {
//     console.error(error);
//     Alert.alert("Download Error", "Failed to download file.");
//   }
// };

const LicenseItems = (licenses: License[]) => {
  if (licenses.length === 0) {
    return <Text style={styles.emptyState}>No licenses found</Text>;
  }

  return licenses.map((license, index) => (
    <View key={index} style={styles.licenseRow}>
      <TouchableOpacity
        style={styles.itemColumn}
        onPress={() => openFile(license.file as string)}
      >
        <Text style={styles.nameText}>{license.name}</Text>

        <Text style={styles.typeText}>
          {format(new Date(license.date), "MMM dd, yyyy")}
        </Text>
        <Text style={styles.typeText}>{license.number}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.shareIcon}
        onPress={() => shareFile(license.file as string)}
      >
        <MaterialIcons name="share" size={28} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  ));
};

const LicenseScreen = ({ userInfo }: LicenseProps) => {
  const { t } = useTranslation();

  const headerHeight = useHeaderHeight();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isAddLicenseBottomSheetVisible, setIsAddLicenseBottomSheetVisible] =
    useState<boolean>(false);

  const {
    isLoading,
    data: licenses,
    refetch: reloadLicenses,
  } = useLicenses(userInfo?.staff_code as string);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your data fetching logic here.
      await reloadLicenses();
    } catch (error) {
      // console.error("Error refreshing emergency contacts", error);
      Alert.alert("Error refreshing emergency contacts");
    } finally {
      // Wait for 3 seconds before setting refreshing to false
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [reloadLicenses]);

  const navigation = useNavigation<AppNavigationProp>();
  useLayoutEffect(() => {
    // Set the navigation header title
    navigation.setOptions({
      title: t("admin.drawer.menu.licenses"),
      // headerTitleAlign: 'center',
      headerTransparent: true,
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
      },
      headerRight: () => (
        <View style={{ flexDirection: "row", paddingRight: 5 }}>
          <MaterialIcons
            name={"post-add"}
            size={25}
            color={theme.colors.primary}
            style={{ marginRight: 10 }}
            onPress={() => setIsAddLicenseBottomSheetVisible(true)}
          />
        </View>
      ),
    });
  }, [navigation]);

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
          {LicenseItems(licenses as License[])}
        </ScrollView>
      </SafeAreaView>
      {isAddLicenseBottomSheetVisible && (
        <AddLicenseBottomSheet
          isVisible={isAddLicenseBottomSheetVisible}
          onClose={() => setIsAddLicenseBottomSheetVisible(false)}
        />
      )}
    </>
  );
};

export default LicenseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  licenseHeader: {
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    justifyContent: "space-between",
    alignItems: "center",
  },
  licenseRow: {
    marginTop: 15,
    marginHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF", // Add a background color to enhance visibility
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  itemColumn: {
    flex: 1, // Take up all available space except for what the icon column uses
    justifyContent: "center",
  },

  nameText: {
    paddingLeft: 10,
    fontSize: 18,
    color: "#333",
    marginBottom: 4, // Space between date and name
    fontWeight: "bold",
  },
  typeText: {
    paddingLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  rowLabel: {
    fontSize: 16,
    color: "#333333",
  },
  shareIcon: {
    paddingRight: 10,
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    // marginBottom: 5,
    marginLeft: 20,
  },
  emptyState: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
    paddingHorizontal: 10,
  },
});
