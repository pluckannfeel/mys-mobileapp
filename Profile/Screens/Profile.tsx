import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import React, { useLayoutEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../AppScreens";
import { useTheme } from "../../core/contexts/ThemeProvider";
import { UserInfo } from "../../auth/types/userInfo";
import { HEIGHT } from "../../core/constants/dimensions";
import { useTranslation } from "react-i18next";

const UserProfileSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string().required("Required"),
  // Add other fields validation according to your needs
});

type ProfileScreenProps = {
  userInfo: UserInfo;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userInfo }) => {
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigationProp>();
  const theme = useTheme();
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

  return (
    <Formik
      initialValues={userInfo}
      validationSchema={UserProfileSchema}
      onSubmit={(values) => {
        console.log(values);
        // Handle form submission
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          {/* Profile Image */}
          <Image
            // source={{ uri: initialValues.img_url }}
            source={{ uri: userInfo.img_url }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{userInfo.english_name}</Text>
          <Text style={styles.role}>{userInfo.role}</Text>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Field
              as={TextInput}
              name="email"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
              placeholder="Email address"
              style={styles.input}
            />
            <Ionicons name="mail-outline" size={24} color="#f43f5e" />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* ... other fields ... */}

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit as any} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    marginTop: HEIGHT / 10,
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  role: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
  button: {
    backgroundColor: "#f43f5e",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // ... add styles for other components as needed ...
});
