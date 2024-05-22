import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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
import AddDocumentBottomSheet from "../components/AddDocumentBottomSheet";

type DocumentProps = {
  userInfo: UserInfo;
};

const DocumentScreen = ({ userInfo }: DocumentProps) => {
  const { t } = useTranslation();

  const headerHeight = useHeaderHeight(); 
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isAddDocumentBottomSheetVisible, setIsAddDocumentBottomSheetVisible] =
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
      title: t("admin.drawer.menu.document"),
      // headerTitleAlign: 'center',
      headerTransparent: true,
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
      },
      // headerRight: () => (
      //   <View style={{ flexDirection: "row", paddingRight: 5 }}>
      //     <MaterialIcons
      //       name={"post-add"}
      //       size={25}
      //       color={theme.colors.primary}
      //       style={{ marginRight: 10 }}
      //       onPress={() => setIsAddDocumentBottomSheetVisible(true)}
      //     />
      //   </View>
      // ),
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
        ></ScrollView>
      </SafeAreaView>
      {isAddDocumentBottomSheetVisible && (
        <AddDocumentBottomSheet
          isVisible={isAddDocumentBottomSheetVisible}
          onClose={() => setIsAddDocumentBottomSheetVisible(false)}
        />
      )}
    </>
  );
};

export default DocumentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  requestHeader: {
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestRow: {
    // margin: 20,
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateColumnHeader: {
    // Adjust according to your layout
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  dateColumn: {
    // flex: 1
    // textAlign: "right"
    justifyContent: "center",
  },
  dateLabel: {
    fontSize: 16,
    color: "#333333",
  },
  dateText: {
    fontSize: 18,
    color: "#333333",
    // marginLeft: 5,
    marginVertical: 5,
    fontWeight: "bold",
  },
  typeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    // marginBottom: 5,
    marginLeft: 20,
  },
  emptyState: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
