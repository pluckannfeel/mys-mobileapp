import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LeaveRequest } from "../types/LeaveRequest";
import { theme } from "../../core/theme/theme";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ReportRadioGroup from "./ReportRadioButton";
import { leave_types } from "../helpers/pickerOptions";

interface LeaveRequestFormProps {
  submitForm: (values: LeaveRequest) => void;
  leaveRequestData: LeaveRequest;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  submitForm,
  leaveRequestData,
}) => {
  const { t, i18n } = useTranslation();

  const currLanguage = i18n.language;

  const initialValues: LeaveRequest = {
    ...leaveRequestData,
    start_date: new Date(),
    end_date: new Date(),
  };

  const formik = useFormik({
    initialValues,
    // validationSchema,
    // onSubmit,
    onSubmit: (values) => {
      submitForm(values as LeaveRequest);
      // console.log(values)
    },
  });
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={styles.container}
        // contentContainerStyle={{ paddingBottom: 160 }}
      >
        <Text style={styles.note}>{t("leaveRequest.form.note")}</Text>

        {/* meal frequency */}
        <ReportRadioGroup
          name="leave_type" // replace with the name of your field
          options={leave_types}
          formik={formik}
          headerLabel={t("leaveRequest.form.leave_type.label")}
        />

        <View style={styles.dateFieldContainer}>
          <Text style={styles.dateFieldLabel}>{`${t(
            "leaveRequest.form.start_date.label"
          )} :`}</Text>
          <DateTimePicker
            display="default"
            mode="date"
            value={formik.values.start_date}
            onChange={(event, selectedDate) => {
              formik.setFieldValue("start_date", selectedDate);
            }}
            locale={currLanguage === "ja" ? "ja-JP" : "en-US"}
            style={styles.dateFieldInput}
          />
        </View>

        <View style={styles.dateFieldContainer}>
          <Text style={styles.dateFieldLabel}>{`${t(
            "leaveRequest.form.end_date.label"
          )} :`}</Text>
          <DateTimePicker
            display="default"
            mode="date"
            locale={currLanguage === "ja" ? "ja-JP" : "en-US"}
            value={formik.values.end_date} // Make sure 'end_date' is part of your form's initial values
            onChange={(event, selectedDate) => {
              formik.setFieldValue("end_date", selectedDate);
            }}
            style={styles.dateFieldInput}
          />
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.sectionHeader}>
            {/* <MaterialCommunityIcons
              name="account"
              size={24}
              color={theme.colors.pink400}
            /> */}
            <Text style={styles.header}>
              {t("leaveRequest.form.details.label")}
            </Text>
          </View>
          <TextInput
            numberOfLines={4}
            multiline
            placeholder={t("leaveRequest.form.details.placeholder")}
            style={[styles.dividerInput, { maxHeight: 120 }]}
            onChangeText={formik.handleChange("details")}
            onBlur={formik.handleBlur("details")}
            value={formik.values.details}
          />
        </View>

        <TouchableOpacity
          style={
            !formik.dirty && !formik.isSubmitting
              ? styles.disabledButton
              : styles.submitButton
          }
          onPress={() => formik.handleSubmit()}
          disabled={!formik.dirty && !formik.isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {t("shift.shiftReport.form.actions.submitReport")}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
export default LeaveRequestForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: 20,
    // paddingBottom: 30,
    paddingHorizontal: 10,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    paddingVertical: 10,
    marginLeft: 5,
    // Add other header styling as needed
  },
  note: {
    textAlign: "left",
    fontSize: 16,
    paddingHorizontal: 10,
  },
  checkboxLabel: {
    fontSize: 18,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 4,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  dividerContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  dividerInput: {
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  dateFieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dateFieldLabel: {
    flex: 1, // Take up 1/3 of the space
    fontSize: 16,
    fontWeight: "bold",
  },
  dateFieldInput: {
    flex: 2, // Take up 2/3 of the space
    // borderWidth: 1,
    // borderColor: '#CCCCCC',
    padding: 8,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: theme.colors.pink400, // This should match the knob color
    borderRadius: 16,
    padding: 12,
    width: "50%", // Set width to 50% of the screen
    alignSelf: "center", // Center the button
    marginTop: 20, // Margin top for spacing
  },
  submitButtonText: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC", // A grey color for the disabled state
    borderRadius: 16,
    padding: 12,
    width: "50%",
    alignSelf: "center",
    marginTop: 20,
  },
  // outgoing assistance record
  outgoingAssistanceContainer: {
    // paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between", // Adjusts children to be spaced out vertically
    marginBottom: 10, // Adds bottom margin for spacing between fields
  },
  addButton: {
    color: "#007bff", // Example color
    padding: 10,
    // borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: "#dc3545", // Example color
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    // color: "#fff",
    color: "#007bff", // Example color
    fontSize: 18,
  },
});
