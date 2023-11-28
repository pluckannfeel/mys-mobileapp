import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import _ from 'lodash';
import { FormikProps } from 'formik';
import { theme } from "../../core/theme/theme";

interface Option {
  label: string;
  value: string;
}

interface RadioButtonProps {
  isSelected: boolean;
}

interface RadioGroupProps<T> {
  name: keyof T | string;
  options: Option[];
  formik: FormikProps<T>;
  headerLabel: string;
}

// RadioButton remains a simple presentation component
const RadioButton: React.FC<RadioButtonProps> = ({ isSelected }) => (
  <View style={styles.circle}>
    {isSelected && <View style={styles.checkedCircle} />}
  </View>
);


// Replace `YourFormValues` with the actual type of your form values
const ReportRadioGroup = <T extends object>({ name, options, formik, headerLabel }: RadioGroupProps<T>) => {
  const { t } = useTranslation();

  const getFieldValue = (fieldName: keyof T | string): any => {
    // Use lodash's get with a generic return type
    return _.get(formik.values, fieldName as string);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.groupLabel}>{headerLabel}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.optionRow}
          onPress={() => formik.setFieldValue(name as string, option.value)}
          activeOpacity={0.6}
        >
          <Text style={styles.optionLabel}>{t(option.label)}</Text>
          <RadioButton isSelected={getFieldValue(name) === option.value} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Styles remain largely the same, though you may remove the `onPress` and `alignItems` from `styles.circle`
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  groupLabel: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 20,
    color: "#000", // Adjust the color as per your theme
    // Add any additional styling for the header label here
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    // paddingHorizontal: 30,
    paddingRight: 35,

    paddingLeft: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  optionLabel: {
    fontSize: 16,
    color: "#000",
  },
  circle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.pink400,
    alignItems: "center", // Ensure the children are centered horizontally
    justifyContent: "center", // Ensure the children are centered vertically
  },
  checkedCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.pink400,
  },
  // ... other styles ...
});

export default ReportRadioGroup;
