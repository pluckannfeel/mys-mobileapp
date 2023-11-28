import RNPickerSelect from "react-native-picker-select";
import { StyleProp, View, ViewStyle } from "react-native";

interface DropdownSelectProps {
  items: { label: string; value: string }[];
  onValueChange: (value: string, name: string) => void;
  label: string;
  onDonePress?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  value?: string;
  name: string;
  style?: StyleProp<ViewStyle>;
  placeholderColor: string;
}

export const DropdownSelect: React.FC<DropdownSelectProps> = ({
  items,
  onValueChange,
  onDonePress,
  label,
  // onBlur,
  placeholder,
  value,
  name,
  style,
  placeholderColor = "#000",
}) => {
  return (
    <View style={style}>
      <RNPickerSelect
        onValueChange={(value) => onValueChange(value, name)}
        items={items}
        onDonePress={onDonePress}
        value={value}
        placeholder={{ label: label, color: placeholderColor, value: "" }}
        style={{
          ...pickerSelectStyles,
          placeholder: {
            // color: placeholderColor,
            fontSize: 18,
            // fontWeight: "bold",
          },
        }}

        // You can spread other props if needed
      />
    </View>
  );
};

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 18, // Set your desired font size
    // Add other styles for iOS input
  },
  inputAndroid: {
    fontSize: 18, // Set your desired font size
    // Add other styles for Android input
  },
  pickerItem: {
    fontSize: 18, // Set your desired font size for picker items
    // Add other styles for picker items
  },
  // Add other styles as needed
};
