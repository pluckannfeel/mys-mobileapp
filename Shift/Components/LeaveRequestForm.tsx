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
  Switch,
} from "react-native";
import { LeaveRequest } from "../types/LeaveRequest";
import { theme } from "../../core/theme/theme";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

import DatePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import ReportRadioGroup from "./ReportRadioButton";
import { leave_types } from "../helpers/pickerOptions";
import { format } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import DropDownPicker from "react-native-dropdown-picker";
import CustomMultiSelectDates from "../../core/Components/CustomMultiSelectDates";

interface LeaveRequestFormProps {
  submitForm: (values: LeaveRequest, isEdit: boolean) => void;
  leaveRequestData: LeaveRequest;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  submitForm,
  leaveRequestData,
}) => {
  const { t, i18n } = useTranslation();
  const timeZone = "Asia/Tokyo";

  const editMode = Boolean(leaveRequestData && leaveRequestData.id);

  // for android only
  const [isStartDatePickerAndroidVisible, setStartDatePickerAndroidVisibility] =
    useState(false);
  const [isEndDatePickerAndroidVisible, setEndDatePickerAndroidVisibility] =
    useState(false);

  // Switch state to control enabling/disabling CustomMultiSelectDates
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = useState(
    leaveRequestData?.paid_leave_dates === "" ? false : true
  );

  // state for days that you will use paid leave 'yuukyuu'
  const [selectedIntervalDates, setSelectedIntervalDates] = useState<string[]>(
    []
  );

  const [selectedPaidLeaveList, setSelectedPaidLeaveList] = useState<string[]>(
    leaveRequestData?.paid_leave_dates
      ? leaveRequestData.paid_leave_dates.split(",")
      : []
  );
  // const [openPicker, setOpenPicker] = useState<boolean>(false);

  const updateIntervalDates = (startDate: Date, endDate: Date) => {
    const dates: string[] = [];
    let current = new Date(startDate);

    while (current <= endDate) {
      dates.push(format(current, "yyyy-MM-dd"));
      current.setDate(current.getDate() + 1); // Increment by one day
    }

    // Ensure the endDate is included (in case of time discrepancies)
    if (!dates.includes(format(endDate, "yyyy-MM-dd"))) {
      dates.push(format(endDate, "yyyy-MM-dd"));
    }

    setSelectedIntervalDates(dates);
  };

  const handleStartDateChange = (date: Date) => {
    formik.setFieldValue("start_date", date);
    updateIntervalDates(date, formik.values.end_date);
  };

  const handleEndDateChange = (date: Date) => {
    formik.setFieldValue("end_date", date);
    updateIntervalDates(formik.values.start_date, date);
  };

  useEffect(() => {
    // Initial calculation when form values are set
    updateIntervalDates(formik.values.start_date, formik.values.end_date);
  }, []);

  const handleAndroidStartDateConfirm = (date: Date) => {
    // console.warn("A date has been picked: ", date);
    formik.setFieldValue("start_date", date || formik.values.start_date);
    setStartDatePickerAndroidVisibility(false);
  };

  const handleAndroidEndDateConfirm = (date: Date) => {
    // console.warn("A date has been picked: ", date);
    formik.setFieldValue("end_date", date || formik.values.start_date);
    setEndDatePickerAndroidVisibility(false);
  };

  // switch leave_type to enable/disabled select date custom multi select field
  const toggleMultiSelect = () => {
    const newState = !isMultiSelectEnabled;
    setIsMultiSelectEnabled(newState);
    setSelectedPaidLeaveList([]);

    // ✅ Update Formik's leave_type field based on the switch state
    formik.setFieldValue("leave_type", newState ? "paid" : "unpaid");

    // ✅ Mark the form as dirty so the submit button enables
    formik.setFieldTouched("leave_type", true, false);
  };

  const currLanguage = i18n.language;

  const initialValues: LeaveRequest = {
    ...leaveRequestData,
    paid_leave_dates: "",
    leave_type: leaveRequestData ? leaveRequestData.leave_type : "",
    start_date: leaveRequestData
      ? new Date(leaveRequestData.start_date)
      : new Date(),
    end_date: leaveRequestData
      ? new Date(leaveRequestData.end_date)
      : new Date(),
    number_of_days: 0,
    details: leaveRequestData ? leaveRequestData.details : "",
  };

  const validationSchema = Yup.object().shape({
    start_date: Yup.date()
      .required(t("leaveRequest.form.error.required"))
      .max(Yup.ref("end_date"), ({ max }) =>
        t("leaveRequest.form.error.invalidDate")
      ),
    end_date: Yup.date()
      .required("End date is required")
      .min(Yup.ref("start_date"), ({ min }) =>
        t("leaveRequest.form.error.invalidDate")
      ),
    // ... other field validations
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    // onSubmit,
    onSubmit: (values) => {
      submitForm(
        {
          ...values,
          // number_of_days: parseInt(values.number_of_days.toString()),
          paid_leave_dates: selectedPaidLeaveList.join(","),
          leave_type: isMultiSelectEnabled ? "paid" : "unpaid",
        } as LeaveRequest,
        editMode
      );
    },
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        // behavior={"padding"}
        style={{ flex: 1 }}
      > */}
      <ScrollView
        style={styles.container}
        // contentContainerStyle={{ paddingBottom: 160 }}
      >
        <Text style={styles.note}>{t("leaveRequest.form.note")}</Text>
        {/*
        <ReportRadioGroup
          name="leave_type" // replace with the name of your field
          options={leave_types}
          formik={formik}
          headerLabel={t("leaveRequest.form.leave_type.label")}
        /> */}

        {/* <View style={styles.dividerContainer}>
          <Text style={styles.header}>
            {t("leaveRequest.form.number_of_days.label")}
          </Text>
          <TextInput
            numberOfLines={1}
            // placeholder={t("leaveRequest.form.number_of_days.label")}
            style={[styles.dividerInput]}
            keyboardType="number-pad"
            onChangeText={formik.handleChange("number_of_days")}
            onBlur={formik.handleBlur("number_of_days")}
            // value={formik.values.number_of_days}
            value={formik.values.number_of_days.toString()}
          />
        </View> */}

        <View style={styles.dateFieldContainer}>
          <Text style={styles.dateFieldLabel}>{`${t(
            "leaveRequest.form.start_date.label"
          )} :`}</Text>
          {Platform.OS === "ios" ? (
            <DatePicker
              display="default"
              mode="date"
              value={formik.values.start_date}
              maximumDate={new Date(2030, 12, 31)}
              minimumDate={new Date(2024, 1, 1)}
              // onChange={(event: DateTimePickerEvent, selectedDate) => {
              //   // const {
              //   //   type,
              //   //   nativeEvent: { timestamp },
              //   // } = event;
              //   // setStartDatePickerVisible(Platform.OS === "ios");
              //   // formik.setFieldValue(
              //   //   "start_date",
              //   //   selectedDate || formik.values.start_date
              //   // );
              //   const timezoneDate = selectedDate
              //     ? zonedTimeToUtc(selectedDate, timeZone)
              //     : formik.values.start_date;
              //   formik.setFieldValue("start_date", timezoneDate);
              // }}
              onChange={(event, selectedDate) => {
                const date = selectedDate || formik.values.start_date;
                handleStartDateChange(date);
              }}
              locale={currLanguage === "ja" ? "ja-JP" : "en-US"}
              style={styles.dateFieldInput}
            />
          ) : (
            <>
              <TouchableOpacity
                style={{
                  paddingVertical: 5,
                }}
                onPress={() => setStartDatePickerAndroidVisibility(true)}
              >
                {/* <Text>{format(formik.values.start_date, "yyyy/MM/dd")}</Text> */}
                <Text>
                  {format(
                    utcToZonedTime(formik.values.start_date, timeZone),
                    "yyyy/MM/dd"
                  )}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isStartDatePickerAndroidVisible}
                mode="date"
                onConfirm={handleAndroidStartDateConfirm}
                onCancel={() => setStartDatePickerAndroidVisibility(false)}
                onChange={(selectedDate) => {
                  setStartDatePickerAndroidVisibility(
                    !isStartDatePickerAndroidVisible
                  );
                  // formik.setFieldValue(
                  //   "start_date",
                  //   selectedDate || formik.values.start_date
                  // );
                }}
                style={styles.dateFieldInput}
              />
            </>
          )}
        </View>

        {formik.touched.start_date && formik.errors.start_date && (
          <Text style={styles.errorText}>
            {formik.errors.start_date as string}
          </Text>
        )}

        <View style={styles.dateFieldContainer}>
          <Text style={styles.dateFieldLabel}>{`${t(
            "leaveRequest.form.end_date.label"
          )} :`}</Text>
          {Platform.OS === "ios" ? (
            <DatePicker
              display="default"
              mode="date"
              maximumDate={new Date(2030, 12, 31)}
              minimumDate={new Date(2020, 1, 1)}
              locale={currLanguage === "ja" ? "ja-JP" : "en-US"}
              value={formik.values.end_date} // Make sure 'end_date' is part of your form's initial values
              // onChange={(event: DateTimePickerEvent, selectedDate) => {
              //   // setEndDatePickerVisible(Platform.OS === "ios");
              //   // formik.setFieldValue(
              //   //   "end_date",
              //   //   selectedDate || formik.values.end_date
              //   // );
              //   const timezoneDate = selectedDate
              //     ? zonedTimeToUtc(selectedDate, timeZone)
              //     : formik.values.end_date;
              //   formik.setFieldValue("end_date", timezoneDate);
              // }}
              onChange={(event, selectedDate) => {
                const date = selectedDate || formik.values.end_date;
                handleEndDateChange(date);
              }}
              style={styles.dateFieldInput}
            />
          ) : (
            <>
              <TouchableOpacity
                style={{
                  paddingVertical: 5,
                }}
                onPress={() => setEndDatePickerAndroidVisibility(true)}
              >
                {/* <Text>{format(formik.values.end_date, "yyyy/MM/dd")}</Text> */}
                <Text>
                  {format(
                    utcToZonedTime(formik.values.end_date, timeZone),
                    "yyyy/MM/dd"
                  )}
                </Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isEndDatePickerAndroidVisible}
                mode="date"
                onConfirm={handleAndroidEndDateConfirm}
                onCancel={() => setEndDatePickerAndroidVisibility(false)}
                onChange={(selectedDate) => {
                  setEndDatePickerAndroidVisibility(
                    !isEndDatePickerAndroidVisible
                  );
                  // formik.setFieldValue(
                  //   "start_date",
                  //   selectedDate || formik.values.start_date
                  // );
                }}
                style={styles.dateFieldInput}
              />
            </>
          )}
        </View>
        {formik.touched.end_date && formik.errors.end_date && (
          <Text style={styles.errorText}>
            {formik.errors.end_date as string}
          </Text>
        )}

        {/* Switch Button */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>
            {t("leaveRequest.form.leave_type.label")}
          </Text>
          <Switch
            value={isMultiSelectEnabled}
            onValueChange={toggleMultiSelect}
          />
        </View>

        <Text
          style={[
            styles.note,
            {
              marginTop: 20,
              paddingHorizontal: 10,
              color: !isMultiSelectEnabled ? "gray" : "black", // Conditional text color
            },
          ]}
        >
          {t("leaveRequest.form.selectDates.note")}
        </Text>

        <CustomMultiSelectDates
          isMultiSelectEnabled={!isMultiSelectEnabled}
          options={selectedIntervalDates}
          selectedValues={selectedPaidLeaveList}
          onChange={setSelectedPaidLeaveList}
          fieldLabel={t("leaveRequest.form.selectDates.label")}
        />

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
            // autoFocus
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
          <Text style={styles.submitButtonText}>{t("common.save")}</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  );
};
export default LeaveRequestForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: 20,
    // paddingBottom: 50,
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
    // paddingVertical: 10,
    paddingHorizontal: 5,
    // marginVertical: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 16,
    paddingVertical: 10,
    marginLeft: 5,
    // Add other header styling as needed
  },
  note: {
    textAlign: "left",
    fontSize: 16,
    paddingHorizontal: 10,
    fontWeight: "bold",
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
    paddingVertical: 5,
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
    marginBottom: 40, // Margin bottom for spacing
  },
  submitButtonText: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    // paddingVertical: 10,
    paddingTop: 10,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC", // A grey color for the disabled state
    borderRadius: 16,
    padding: 12,
    width: "50%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 40,
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
