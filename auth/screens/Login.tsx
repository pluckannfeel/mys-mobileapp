import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import MainView from "../components/LoginView";
import LoadingButton from "../../core/Components/LoadingButton";
import { useAuth } from "../contexts/AuthProvider";
import { HEIGHT, WIDTH } from "../../core/constants/dimensions";
import { useNavigation, StackActions } from "@react-navigation/native";

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

  const handleLogin = (staff_code: string, password: string) => {
    login(staff_code, password)
      .then((key: string) => {
        // console.log(key);
        // console.log(key)
      })
      .catch((err) => {
        console.log("Error Logging in: ", err);
      });
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
          {formik.touched.staff_code && formik.errors.staff_code && (
            <Text style={styles.errorText}>{formik.errors.staff_code}</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onChangeText={formik.handleChange("password")}
            value={formik.values.password}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="gray"
          />
          {formik.touched.password && formik.errors.password && (
            <Text style={styles.errorText}>{formik.errors.password}</Text>
          )}
        </View>

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
  inputContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 15,
    width: "100%", // Set width to 100% of parent container
    marginBottom: 15, // Add some space between the input fields
  },
  input: {
    paddingVertical: 15, // Add vertical padding
    paddingHorizontal: 20, // Add horizontal padding
    fontSize: 16,
    borderRadius: 15, // Add borderRadius for iOS input
    borderWidth: 0, // Remove borderWidth for iOS
    color: "black", // Set text color
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
