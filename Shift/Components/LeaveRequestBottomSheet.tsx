import React, { useMemo } from "react";
import { View, StyleSheet, Text, ViewStyle, StyleProp } from "react-native";
import BottomSheet, { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import ShiftReportForm from "./ShiftReportForm"; // Adjust the import path as needed
import { ShiftReport } from "../types/Shift"; // Adjust the import path as needed
import { useTranslation } from "react-i18next";
import { convertToTimeString } from "../../core/helpers/functions";
import { utcToZonedTime } from "date-fns-tz";

import Toast from "react-native-toast-message";
import LeaveRequestForm from "./LeaveRequestForm";
import { LeaveRequest } from "../types/LeaveRequest";
import { useAddLeaveRequest } from "../hooks/useAddLeaveRequest";
import { useUserInfo } from "../../auth/hooks/useUserInfo";
import { useAuth } from "../../auth/contexts/AuthProvider";

// Create a type for the ref object
export type BottomSheetRef = {
  expand: () => void;
  close: () => void;
};

interface LeaveRequestBottomSheetProps {
  // info: ShiftReport;
  // onSubmit: (values: ShiftReport) => void;
  isVisible: boolean;
  onClose: () => void;
}

const LeaveRequestBottomSheet: React.FC<LeaveRequestBottomSheetProps> = ({
  // info,
  // onSubmit,
  isVisible,
  onClose,
}) => {
  // The snap points for the bottom sheet
  // const snapPoints = useMemo(() => ["40%", "75%", "90"], []);
  const snapPoints = useMemo(() => ["90"], []);
  const { t } = useTranslation();

  // get mys id to pass to the form
  const { userInfo } = useAuth();
  const { isAdding, addLeaveRequest } = useAddLeaveRequest();

  const processing = isAdding;

  const submitReportHandler = (values: LeaveRequest) => {
    addLeaveRequest({
      ...values,
      mys_id: userInfo?.staff_code as string,
    })
      .then((data) => {
        Toast.show({
          type: "success",
          text1: t("common.success"),
          text2: t("leaveRequest.notifications.addSuccessLeaveRequest"),
          visibilityTime: 4000,
          topOffset: 60,
        });
      })
      .catch((error) => {
        const detail = error.response.data.detail;
        if (detail === "pending_leave_request") {
          Toast.show({
            type: "error",
            text1: t("common.error"),
            text2: t("leaveRequest.notifications.existingLeaveRequest"),
            visibilityTime: 8000,
            topOffset: 60,
          });
        } else {
          Toast.show({
            type: "error",
            text1: t("common.error"),
            text2: t("leaveRequest.notifications.errorLeaveRequest"),
            visibilityTime: 3000,
            topOffset: 60,
          });
        }
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <BottomSheet
      // index={isVisible ? 1 : -1}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      onClose={onClose}
      backdropComponent={CustomBackdrop}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t("leaveRequest.form.label")}</Text>
      </View>
      <View style={styles.divider} />
      {/* The content of the bottom sheet */}
      {/* <ShiftReportForm
        info={initialShiftReport as ShiftReport}
        submitForm={submitReportHandler}
      /> */}
      <LeaveRequestForm
        submitForm={submitReportHandler}
        leaveRequestData={{} as LeaveRequest}
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

export default LeaveRequestBottomSheet;
