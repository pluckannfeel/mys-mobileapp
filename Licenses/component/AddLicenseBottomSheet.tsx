import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, StyleSheet, StyleProp, View, ViewStyle } from "react-native";
import BottomSheet, { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import AddLicenseForm from "./AddLicenseForm";
import { License } from "../../Document/types/Document";
import { useAddLicense } from "../hooks/useAddLicenses";
import Loader from "../../core/Components/Loader";
import { useAuth } from "../../auth/contexts/AuthProvider";
import Toast from "react-native-toast-message";

type BottomSheetRef = {
  expand: () => void;
  close: () => void;
};

type AddLicenseBottomSheetProps = {
  isVisible: boolean;
  onClose: () => void;
};

const AddLicenseBottomSheet: React.FC<AddLicenseBottomSheetProps> = ({
  isVisible,
  onClose,
}) => {
  const snapPoints = useMemo(() => ["60"], []);
  const { t } = useTranslation();
  const { isAdding, addLicense } = useAddLicense();
  const { userInfo } = useAuth();

  const submitLicenseHandler = (values: License) => {
    addLicense({
      staff_id: userInfo?.id as string,
      license: values,
    })
      .then((data) => {
        Toast.show({
          type: "success",
          text1: t("common.success"),
          text2: t("licenses.notifications.addSuccessLicense"),
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
            text2: t("licenses.notifications.existingLicense"),
            visibilityTime: 8000,
            topOffset: 60,
          });
        } else {
          Toast.show({
            type: "error",
            text1: t("common.error"),
            text2: t("licenses.notifications.errorLicense"),
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
      {isAdding ? (
        <Loader />
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>{t("licenses.form.label")}</Text>
          </View>

          <AddLicenseForm submitForm={submitLicenseHandler} />
        </>
      )}
    </BottomSheet>
  );
};

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

export default AddLicenseBottomSheet;
