import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

import { License } from "../../Document/types/Document";
import { theme } from "../../core/theme/theme";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import DatePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { format } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { useAuth } from "../../auth/contexts/AuthProvider";

import FileInput, { File } from "../../core/Components/FileInput";

interface LicenseFormProps {
  submitForm: (values: License) => void;
}

const AddLicenseForm: React.FC<LicenseFormProps> = ({ submitForm }) => {
  const { t, i18n } = useTranslation();
  const timeZone = "Asia/Tokyo";

  const { userInfo } = useAuth();

  const [
    isDateAcquiredPickerAndroidVisible,
    setDateAcquiredPickerAndroidVisibility,
  ] = useState(false);

  const initialValues: License = {
    file: "",
    type: "",
    name: "",
    number: "",
    // date: utcToZonedTime(new Date(), timeZone),
    date: new Date(),
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("license.form.name.required")),
    number: Yup.string().required(t("license.form.number.required")),
    date: Yup.date().required(t("license.form.date.required")),
    file: Yup.string().required(t("license.form.file.required")),
    type: Yup.string().required(t("license.form.type.required")),
    // ... other field validations
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    // onSubmit,
    onSubmit: (values) => {
      submitForm(values);
    },
  });

  const handleAndroidEndDateAcquiredConfirm = (date: Date) => {
    // console.warn("A date has been picked: ", date);
    formik.setFieldValue("date", date || formik.values.date);
    setDateAcquiredPickerAndroidVisibility(false);
  };

  const currLanguage = i18n.language;

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 160,
      }}
    >
      <View style={styles.fileFieldContainer}>
        <Text style={styles.dateFieldLabel}>{`${t(
          "licenses.form.file.label"
        )}`}</Text>

        <FileInput
          onFileSelect={(file: File) => {
            formik.setFieldValue("file", file.uri);
            formik.setFieldValue("type", file.type);
          }}
        />
      </View>

      <View style={styles.dividerContainer}>
        <Text style={styles.header}>{t("licenses.form.name.label")}</Text>
        <TextInput
          numberOfLines={1}
          style={[styles.dividerInput]}
          onChangeText={formik.handleChange("name")}
          onBlur={formik.handleBlur("name")}
          value={formik.values.name}
        />
      </View>

      <View style={styles.dividerContainer}>
        <Text style={styles.header}>{t("licenses.form.number.label")}</Text>

        <TextInput
          numberOfLines={1}
          style={[styles.dividerInput]}
          onChangeText={formik.handleChange("number")}
          onBlur={formik.handleBlur("number")}
          value={formik.values.number}
        />
      </View>

      <View style={styles.dateFieldContainer}>
        <Text style={styles.dateFieldLabel}>{`${t(
          "licenses.form.date_acquired.label"
        )}`}</Text>

        {Platform.OS === "ios" ? (
          <DatePicker
            display="default"
            mode="date"
            value={formik.values.date}
            maximumDate={new Date(2030, 11, 31)}
            minimumDate={new Date(2000, 1, 1)}
            positiveButton={{
              label: "OK",
              textColor: theme.colors.pink400,
            }}
            onChange={(event: DateTimePickerEvent, selectedDate) => {
              const timezoneDate = selectedDate
                ? zonedTimeToUtc(selectedDate, timeZone)
                : formik.values.date;
              formik.setFieldValue("date", timezoneDate);
            }}
            locale="en-US"
            style={styles.dateFieldInput}
          />
        ) : (
          <>
            <TouchableOpacity
              style={{
                paddingVertical: 5,
              }}
              onPress={() => setDateAcquiredPickerAndroidVisibility(true)}
            >
              {/* <Text>{format(formik.values.start_date, "yyyy/MM/dd")}</Text> */}
              <Text>
                {format(
                  utcToZonedTime(formik.values.date, timeZone),
                  "yyyy/MM/dd"
                )}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDateAcquiredPickerAndroidVisible}
              mode="date"
              date={formik.values.date}
              maximumDate={new Date(2030, 11, 31)}
              minimumDate={new Date(2000, 0, 1)}
              onConfirm={handleAndroidEndDateAcquiredConfirm}
              onCancel={() => setDateAcquiredPickerAndroidVisibility(false)}
              style={styles.dateFieldInput}
            />
          </>
        )}
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
        <Text style={styles.submitButtonText}>{t("common.save")}</Text>
      </TouchableOpacity>
    </ScrollView>

    // </TouchableWithoutFeedback>
  );
};

export default AddLicenseForm;

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
    paddingHorizontal: 20,
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
    paddingHorizontal: 5,
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
  fileFieldContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
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
