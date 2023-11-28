import React, { useMemo } from "react";
import { View, StyleSheet, Text, ViewStyle, StyleProp } from "react-native";
import BottomSheet, { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import ShiftReportForm from "./ShiftReportForm"; // Adjust the import path as needed
import { ShiftReport } from "../types/Shift"; // Adjust the import path as needed
import { useTranslation } from "react-i18next";
import { useSelectedShift } from "../contexts/SelectedShiftProvider";
import { convertToTimeString } from "../../core/helpers/functions";
import { utcToZonedTime } from "date-fns-tz";
import { useShiftReport } from "../hooks/useShiftReport";
import { useAddShiftReport } from "../hooks/useAddShiftReport";
import { useUpdateShiftReport } from "../hooks/useUpdateShiftReport";

import Toast from "react-native-toast-message";

// Create a type for the ref object
export type BottomSheetRef = {
  expand: () => void;
  close: () => void;
};

interface ReportBottomSheetProps {
  // info: ShiftReport;
  // onSubmit: (values: ShiftReport) => void;
  isVisible: boolean;
  onClose: () => void;
}

const ReportBottomSheet: React.FC<ReportBottomSheetProps> = ({
  // info,
  // onSubmit,
  isVisible,
  onClose,
}) => {
  // The snap points for the bottom sheet
  const snapPoints = useMemo(() => ["50%", "75%", "90%"], []);
  const { t } = useTranslation();
  const { selectedShift } = useSelectedShift();
  const { data: shiftReportData, refetch } = useShiftReport(selectedShift.id);

  const { isAdding, addShiftReport } = useAddShiftReport();
  const { isUpdating, updateShiftReport } = useUpdateShiftReport();

  const processing = isAdding || isUpdating;

  const initialShiftReport: Partial<ShiftReport> = {
    id: shiftReportData ? shiftReportData.id : "", // id is passed here because we need to identify if the shift report will apply edit or craete
    shift_id: shiftReportData ? shiftReportData.shift_id : selectedShift.id,
    patient: shiftReportData ? shiftReportData.patient : selectedShift.patient,
    service_hours: shiftReportData
      ? shiftReportData.service_hours
      : selectedShift.end.toString().length < 6
      ? `${selectedShift.start} - ${selectedShift.end}`
      : `${convertToTimeString(
          utcToZonedTime(selectedShift.start, "Asia/Tokyo")
        )} - ${convertToTimeString(
          utcToZonedTime(selectedShift.end, "Asia/Tokyo")
        )}`,
    toilet_assistance: shiftReportData?.toilet_assistance,
    meal_assistance: shiftReportData?.meal_assistance,
    bath_assistance: shiftReportData?.bath_assistance,
    grooming_assistance: shiftReportData?.grooming_assistance,
    positioning_assistance: shiftReportData?.positioning_assistance,
    medication_medical_care: shiftReportData?.medication_medical_care,
    daily_assistance: shiftReportData?.daily_assistance,
    outgoing_assistance: shiftReportData?.outgoing_assistance,
  };

  // came from bottom sheet prop drilled, then will be passed to parent which is either calendar view or default view
  // const submitReportHandler = (values: ShiftReport) => {
  //   onSubmit({...values, shift_id: selectedShift.id, id: shiftReportData?.id as string});
  // };

  const submitReportHandler = (values: ShiftReport) => {
    // check if there is shift_report id (remember shift_id and reportid are different)
    const formValues = {
      ...values,
      shift_id: selectedShift.id,
      id: shiftReportData?.id as string,
    };

    if (formValues.id) {
      //edit
      updateShiftReport(formValues as ShiftReport)
        .then((data) => {
          Toast.show({
            type: "success",
            text1: t("common.success"),
            text2: t("shift.shiftReport.notifications.updateSuccessReport"),
            visibilityTime: 4000,
            topOffset: 60,
          });

          refetch();
        })
        .catch((error) => {
          const detail = error.response.data.detail;
          if (detail === "report_exists") {
            Toast.show({
              type: "error",
              text1: t("common.error"),
              text2: t("shift.shiftReport.notifications.existingReport"),
              visibilityTime: 8000,
              topOffset: 60,
            });
          } else {
            Toast.show({
              type: "error",
              text1: t("common.error"),
              text2: t("shift.shiftReport.notifications.errorReport"),
              visibilityTime: 3000,
              topOffset: 60,
            });
          }
        });
      // .finally(() => {
      //   refetch();
      // });
    } else {
      addShiftReport(formValues as ShiftReport)
        .then((data) => {
          Toast.show({
            type: "success",
            text1: t("common.success"),
            text2: t("shift.shiftReport.notifications.addSuccessReport"),
            visibilityTime: 4000,
            topOffset: 60,
          });

          refetch();
        })
        .catch((error) => {
          const detail = error.response.data.detail;
          if (detail === "report_exists") {
            Toast.show({
              type: "error",
              text1: t("common.error"),
              text2: t("shift.shiftReport.notifications.existingReport"),
              visibilityTime: 8000,
              topOffset: 60,
            });
          } else {
            Toast.show({
              type: "error",
              text1: t("common.error"),
              text2: t("shift.shiftReport.notifications.errorReport"),
              visibilityTime: 3000,
              topOffset: 60,
            });
          }
        });
      // .finally(() => {
      //   refetch();
      // });
    }
  };

  return (
    <BottomSheet
      index={isVisible ? 1 : -1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      backdropComponent={CustomBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          {t("shift.shiftReport.form.label")}
        </Text>
      </View>
      <View style={styles.divider} />
      {/* The content of the bottom sheet */}
      <ShiftReportForm
        info={initialShiftReport as ShiftReport}
        submitForm={submitReportHandler}
      />
    </BottomSheet>
  );
};

// Extend the BottomSheetBackdropProps to include any additional props you might need
interface CustomBackdropProps extends BottomSheetBackdropProps {
  style?: StyleProp<ViewStyle>;
}

const CustomBackdrop: React.FC<CustomBackdropProps> = ({ style, ...props }) => (
  <View style={[style, styles.backdrop]} {...props} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  handleIndicator: {
    backgroundColor: "#FFC0CB", // Baby pink color for the knob
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000", // Assuming you want black text
  },
  divider: {
    height: 1, // One pixel high line
    backgroundColor: "#E0E0E0", // Light grey color for the divider
    width: "100%", // The divider will fill the width of its container
    marginBottom: 20,
  },

  // ... other styles as needed
});

export default ReportBottomSheet;
