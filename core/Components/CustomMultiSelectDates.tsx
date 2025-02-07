import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { HEIGHT } from "../constants/dimensions";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

interface CustomMultiSelectDatesProps {
  options: string[]; // Dates in string format
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  fieldLabel: string;
  isMultiSelectEnabled: boolean;
}

const CustomMultiSelectDates: React.FC<CustomMultiSelectDatesProps> = ({
  options,
  selectedValues,
  onChange,
  fieldLabel,
  isMultiSelectEnabled,
}) => {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelection = (value: string) => {
    const isSelected = selectedValues.includes(value);

    // If the value is already selected, remove it
    if (isSelected) {
      const updatedValues = selectedValues.filter((item) => item !== value);
      onChange(updatedValues);
    }
    // If it's not selected and the limit isn't exceeded, add it
    else if (selectedValues.length < 10) {
      const updatedValues = [...selectedValues, value];
      onChange(updatedValues);
    }
    // Optionally show a message if the limit is reached
    else {
      alert(t("leaveRequest.form.error.selectMaximumExceeded")); // Assuming you have a translation key for the message
    }
  };

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDayName = (date: string) => {
    const dayIndex = new Date(date).getDay();
    return t(`common.days.${dayIndex}`); // Access the specific day dynamically
  };

  return (
    <View>
      <TouchableOpacity
        disabled={isMultiSelectEnabled}
        onPress={() => setModalVisible(true)}
        style={styles.dividerContainer}
      >
        <Text
          style={[
            styles.dividerInput,
            {
              paddingHorizontal: 20,
              color: isMultiSelectEnabled ? "gray" : "black",
            },
          ]}
        >
          {selectedValues.length > 0 ? selectedValues.join(", ") : fieldLabel}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.dividerContainer}>
            <View style={styles.labelContainer}>
              <Ionicons
                name="search"
                size={20}
                color="#333"
                style={styles.searchIcon}
              />
              <Text style={styles.header}>{t("common.search")}</Text>
            </View>
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t("common.date")}
              style={styles.dividerInput}
            />
          </View>

          <FlatList
            style={styles.flatList}
            data={filteredOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected = selectedValues.includes(item);
              return (
                <TouchableOpacity
                  onPress={() => toggleSelection(item)}
                  style={[
                    styles.optionContainer,
                    isSelected && styles.selectedOption,
                  ]}
                >
                  <View style={styles.optionRow}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {item} ({getDayName(item)})
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#0056b3"
                        style={styles.checkIcon}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>{t("common.close")}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontWeight: "bold",
    fontSize: 18,
    paddingVertical: 10,
    marginLeft: 5,
    // Add other header styling as needed
  },
  dividerContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  dividerInput: {
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  flatList: {
    // marginTop: 10,
    marginBottom: 10,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputText: {
    color: "#000",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // Optional: Add spacing below the header
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: Platform.select({
      ios: HEIGHT * 0.04,
      android: HEIGHT * 0.02,
      default: 0,
    }),
    // paddingBottom: 15,
    marginBottom: Platform.select({
      ios: HEIGHT * 0.01,
      android: HEIGHT * 0.1,
      default: 0,
    }),
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  optionContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "rgba(0, 123, 255, 0.1)", // Light transparent blue
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    fontWeight: "bold",
    color: "#0056b3",
  },
  searchIcon: {
    marginLeft: 10,
  },
  checkIcon: {
    marginLeft: 10,
  },
  closeButton: {
    // marginTop: 10,
    padding: 15,
    width: "60%",
    alignSelf: "center",
    // backgroundColor: "#007bff",
    backgroundColor: "#9A2F7C",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CustomMultiSelectDates;
