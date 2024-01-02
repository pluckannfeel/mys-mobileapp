import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import MainView from "../components/LoginView";
import LoadingButton from "../../core/Components/LoadingButton";
import { useAuth } from "../contexts/AuthProvider";
import { HEIGHT, WIDTH } from "../../core/constants/dimensions";
import { useNavigation, StackActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Define the shape of the form values
interface Credentials {
  staff_code: string;
  password: string;
}

// Yup validation schema
const validationSchema = Yup.object({
  staff_code: Yup.string().required("Staff code is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const { isLoggingIn, login } = useAuth();
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = (staff_code: string, password: string) => {
    login(staff_code, password);
    // handling login action is on auth provider
  };

  const formik = useFormik<Credentials>({
    initialValues: {
      staff_code: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => handleLogin(values.staff_code, values.password),
  });

  return (
    <MainView>
      <View></View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={formik.handleChange("staff_code")}
              value={formik.values.staff_code}
              placeholder="Staff Code"
              placeholderTextColor="gray"
            />
          </View>
          {formik.touched.staff_code && formik.errors.staff_code && (
            <Text style={styles.errorText}>{formik.errors.staff_code}</Text>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={formik.handleChange("password")}
              value={formik.values.password}
              placeholder="Password"
              secureTextEntry={!passwordVisible}
              placeholderTextColor="gray"
            />
            <TouchableOpacity
              style={styles.togglePasswordVisibility}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>

          {formik.touched.password && formik.errors.password && (
            <Text style={styles.errorText}>{formik.errors.password}</Text>
          )}

          <View style={styles.fullWidth}>
            <LoadingButton
              onPress={() => formik.handleSubmit()}
              label="Sign In"
              loading={isLoggingIn}
            />
          </View>

          {/* <View style={styles.centerRow}>
            <Text>No Account yet? </Text>
            <TouchableOpacity onPress={() => router.push("/pages/Register")}>
              <Text style={styles.signUpText}>Sign up here.</Text>
            </TouchableOpacity>
          </View> */}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </MainView>
  );
};

const styles = StyleSheet.create({
  // fullWidthHeight: {},
  keyboardView: {
    width: WIDTH / 1.3, // Use the full width of the parent container
    // alignItems: 'center',
    flex: 1,
    // width: '100%', // Set width to 100% of parent container
    marginTop: HEIGHT * 0.4,
    justifyContent: "center", // Align items vertically centered
    paddingHorizontal: 0, // Add horizontal padding
  },
  // ... other styles ...
  inputContainer: {
    flexDirection: "row", // Align the TextInput and the icon in a row
    alignItems: "center", // Vertically center the icon and the TextInput
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 15,
    width: "100%",
    marginBottom: 15,
  },
  togglePasswordVisibility: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
    padding: 10,
  },
  //j
  input: {
    flex: 1, // Take up all available space except for the icon
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    borderRadius: 15,
    color: "black",
  },
  icon: {
    // Styles for the TouchableOpacity wrapping the icon
    padding: 10,
  },
  errorText: {
    color: "red",
    paddingBottom: 12,
    paddingHorizontal: 20, // Match horizontal padding with input
  },
  fullWidth: {
    width: "100%", // Ensure the button uses the full width of its parent
    marginTop: 10, // Add some margin at the top of the button
  },
  centerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20, // Add some space above the 'No Account yet?' text
  },
  signUpText: {
    color: "#db2777",
  },
});

export default Login;
