import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Formik, Field, useFormik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../AppScreens";
import { useTheme } from "../../core/contexts/ThemeProvider";
import { UserInfo } from "../../auth/types/userInfo";
import { HEIGHT } from "../../core/constants/dimensions";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Profile } from "../types/profile";
import Profileform from "../components/Profileform";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import Toast from "react-native-toast-message";

const UserProfileSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string().required("Required"),
  // Add other fields validation according to your needs
});

type ProfileScreenProps = {
  userInfo: Profile;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userInfo }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigationProp>();
  const theme = useTheme();

  // hook
  const { isUpdating, updateProfile } = useUpdateProfile();

  useLayoutEffect(() => {
    navigation.setOptions({
      // title: t("admin.drawer.menu.profile"),
      // headerTitle: t("admin.drawer.menu.profile"),
      headerTransparent: true,
      // headerTintColor: "#fff",
      headerTitleAlign: "left",

      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
      },

      headerRight: () => (
        <View style={{ flexDirection: "row", paddingRight: 18 }}>
          <Ionicons
            name="settings"
            size={26}
            color={theme.colors.primary}
            onPress={() =>
              navigation.navigate("Private", {
                screen: "Settings",
              })
            }
          />
        </View>
      ),
    });
  }, [navigation]);

  const saveProfileHandler = (values: Profile) => {
    // console.log(values);
    updateProfile(values)
      .then((data) => {
        Toast.show({
          type: "success",
          text1: t("common.success"),
          text2: t("profile.notifications.updateSuccess"),
          visibilityTime: 4000,
          topOffset: 60,
        });
      })
      .catch((error) => {
        // const detail = error.response.data.detail;
        // if (detail === "pending_leave_request") {
        //   Toast.show({
        //     type: "error",
        //     text1: t("common.error"),
        //     text2: t("leaveRequest.notifications.existingLeaveRequest"),
        //     visibilityTime: 8000,
        //     topOffset: 60,
        //   });
        // } else {

        // }

        Toast.show({
          type: "error",
          text1: t("common.error"),
          text2: t("profile.notifications.updateFailed"),
          visibilityTime: 3000,
          topOffset: 60,
        });
      });
  };

  // console.log(userInfo)

  return isUpdating ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: theme.colors.secondary,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  ) : (
    <Profileform saveProfile={saveProfileHandler} profileData={userInfo} />
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  // ... add styles for other components as needed ...
});
