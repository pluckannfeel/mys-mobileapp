import { StyleSheet, Text, View } from "react-native";
import React, { forwardRef, useMemo } from "react";
import { BottomSheetModal, useBottomSheet } from "@gorhom/bottom-sheet";
import CustomBackdrop from "../../Shift/Components/BottomSheetBackdrop";
export type Ref = BottomSheetModal;

interface BottomModalSheetProps {
  snapPoints: string[];
  children: React.ReactNode;
  index: number;
  headerText?: string;
  enablePanDownToClose?: boolean;
  onClose: () => void; // Add this prop to handle closing
}

const CustomButtomSheetModal = forwardRef<Ref, BottomModalSheetProps>(
  ({ snapPoints, children, headerText, index, enablePanDownToClose, onClose }, ref) => {
    return (
      <BottomSheetModal
        ref={ref}
        index={index}
        snapPoints={snapPoints}
        detached={true}
        backdropComponent={(props) => (
          <CustomBackdrop {...props} onClose={onClose} />
        )}
        enablePanDownToClose={enablePanDownToClose}
      >
        <View style={styles.contentContainer}>
          {headerText && (
            <Text style={styles.containerHeadline}>{headerText}</Text>
          )}
          {children}
        </View>
      </BottomSheetModal>
    );
  }
);
export default CustomButtomSheetModal;
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
  },
  containerHeadline: {
    // flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
