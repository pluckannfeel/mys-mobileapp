import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

interface CustomBackdropProps extends BottomSheetBackdropProps {
  style?: StyleProp<ViewStyle>;
  onClose: () => void; // Add this prop to handle closing
}

export const CustomBackdrop: React.FC<CustomBackdropProps> = ({
  style,
  onClose, // Destructure the onClose prop
  ...props
}) => (
  <TouchableOpacity
    style={[style, styles.backdrop]}
    activeOpacity={1} // Prevents the opacity change on press
    onPress={onClose} // Close the bottom sheet when the backdrop is pressed
    {...props}
  />
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, // Ensure the backdrop covers the whole screen
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default CustomBackdrop;
