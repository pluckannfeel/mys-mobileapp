import React from "react";
import { Platform, View, StyleProp, ViewStyle } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker";

interface FilterSelectProps {
  items: { label: string; value: number }[];
  onValueChange: (value: number, name: string) => void;
  label: string;
  value?: number;
  name: string;
  style?: StyleProp<ViewStyle>;
  placeholderColor: string;
}

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 20,
    flex: 1,
  },
  inputAndroid: {
    fontSize: 20,
    color: "black",
    borderRadius: 5,
  },
  pickerItem: {
    fontSize: 20,
  },
};

const FilterSelect: React.FC<FilterSelectProps> = React.memo(
  ({
    items,
    onValueChange,
    label,
    value,
    name,
    style,
    placeholderColor = "#000",
  }) => {
    // Render different picker based on the platform
    if (Platform.OS === "android") {
      return (
        <View
          style={{
            // ...style,
            // borderWidth: 1,
            // borderColor: "#000",
            // borderRadius: 5,
            paddingVertical: 10,
            // marginBottom: 10,
            minWidth: "35%",
          }}
        >
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => onValueChange(itemValue, name)}
            style={pickerSelectStyles.inputAndroid}
            dropdownIconColor={placeholderColor}
          >
            {/* Placeholder item */}
            {/* {label && <Picker.Item label={label} value="" />} */}
            {/* Other items */}
            {items.map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>
        </View>
      );
    } else {
      // iOS and other platforms use RNPickerSelect
      return (
        <View style={style}>
          <RNPickerSelect
            onValueChange={(value) => onValueChange(value, name)}
            items={items}
            value={value}
            placeholder={{ label: label, color: placeholderColor, value: "" }}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 0,
                right: -25,
              },
            }}
            useNativeAndroidPickerStyle={false}
          />
        </View>
      );
    }
  }
);

export { FilterSelect };
