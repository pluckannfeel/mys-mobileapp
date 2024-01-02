import RNPickerSelect from "react-native-picker-select";
import { StyleProp, View, ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface FilterSelectProps {
  items: { label: string; value: number }[];
  onValueChange: (value: number, name: string) => void;
  label: string;
  onDonePress?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  value?: number;
  name: string;
  style?: StyleProp<ViewStyle>;
  placeholderColor: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
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
        useNativeAndroidPickerStyle={false}
        onDonePress={onDonePress}
        value={value}
        placeholder={{ label: label, color: placeholderColor, value: "" }}
        // Icon={
        //   // @ts-ignore
        //   () => <MaterialIcons name="arrow-drop-down" size={24} color="#000" />
        // }
        // Icon={() => {
        //   return <Ionicons name="md-arrow-down" size={24} color="gray" />;
        // }}
        style={{
          ...pickerSelectStyles,
          placeholder: {
            // color: placeholderColor,
            fontSize: 18,
            // fontWeight: "bold",
          },
          iconContainer: {
            top: 0,
            right: -25,
          },
        }}

        // You can spread other props if needed
      />
    </View>
  );
};

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 20,
    flex: 1, // Ensure input takes the available space excluding icon
    // Add other styles for iOS input
  },
  inputAndroid: {
    fontSize: 20,
    flex: 1,
    color: 'black', // Set a text color here
    // Other styles...
  },
  pickerItem: {
    fontSize: 20, // Set your desired font size for picker items
    // Add other styles for picker items
  },
  // Add other styles as needed
};
