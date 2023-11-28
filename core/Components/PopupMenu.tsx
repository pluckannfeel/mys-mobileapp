// PopupMenu.js
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";

interface PopupMenuProps {
  visible: boolean;
  onClose: () => void;
  menuOptions: MenuOption[];
}

interface MenuOption {
  text: string;
  onPress: () => void;
}

const PopupMenu: React.FC<PopupMenuProps> = ({
  visible,
  onClose,
  menuOptions,
}) => {
    const {t} = useTranslation()

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} >
          <View style={styles.modalView}>
            {menuOptions.map((option, index) => (
              <TouchableHighlight
                key={index}
                style={styles.button}
                underlayColor="#DDDDDD"
                onPress={() => {
                  onClose();
                  option.onPress();
                }}
              >
                <Text style={styles.buttonText}>{option.text}</Text>
              </TouchableHighlight>
            ))}
          </View>

          <TouchableHighlight
            style={styles.cancelButton}
            underlayColor="#DDDDDD"
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>{t("common.cancel")}</Text>
          </TouchableHighlight>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
    paddingBottom: 50
  },
  modalView: {
    backgroundColor: "white",
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12,
    borderRadius: 12,
    
    width: "90%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    // marginBottom: 4, // Add some space before the cancel button
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#CDCDCD",
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#000",
    // alignSelf: "flex-start",
    fontWeight: "500",
    marginHorizontal: 16,
    textAlign: "center",
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
    // marginHorizontal: 16,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#F9F9F9",
  },
  cancelButtonText: {
    
    fontSize: 20,
    fontWeight: "400",
    color: "#007AFF",
    textAlign: "center",
  },
});

export default PopupMenu;
