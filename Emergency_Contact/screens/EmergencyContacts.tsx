import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { UserInfo } from "../../auth/types/userInfo";
import { useEmergencyContacts } from "../hooks/useEmergencyContacts";
import { useNavigation, StackActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { AppNavigationProp } from "../../AppScreens";
import { useHeaderHeight } from "@react-navigation/elements";
import { MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme/theme";
import Loader from "../../core/Components/Loader";
import LeaveRequestBottomSheet from "../../Shift/Components/LeaveRequestBottomSheet";
import { EmergencyContact } from "../types/EmergencyContact";
import CustomButtomSheetModal from "../../core/Components/CustomBottomSheetModal";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { set } from "date-fns";

type EmergencyContactScreenProps = { userInfo: UserInfo };

const EmergencyContactScreen = ({ userInfo }: EmergencyContactScreenProps) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<AppNavigationProp>();
  const headerHeight = useHeaderHeight();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[] | []>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const { dismiss } = useBottomSheetModal();

  const {
    isLoading,
    data: emergencyContacts,
    refetch: reloadEmergencyContacts,
  } = useEmergencyContacts(userInfo?.staff_code as string);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your data fetching logic here.
      await reloadEmergencyContacts();
    } catch (error) {
      // console.error("Error refreshing emergency contacts", error);
      Alert.alert("Error refreshing emergency contacts");
    } finally {
      // Wait for 3 seconds before setting refreshing to false
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [reloadEmergencyContacts]);

  // console.log(emergencyContacts);

  // header options
  useLayoutEffect(() => {
    // if (!isLoading) {
    navigation.setOptions(
      {
        // title: t("admin.drawer.menu.leaveRequests"),
        headerTitle: t("admin.drawer.menu.emergencyContact"),
        headerTransparent: true,
        // headerTintColor: "#fff",
        // headerTitleAlign: "left",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 24,
        },
        // headerRight: () => (
        //   <View style={{ flexDirection: "row", paddingRight: 5 }}>
        //     <MaterialIcons
        //       name={"post-add"}
        //       size={25}
        //       color={theme.colors.primary}
        //       style={{ marginRight: 10 }}
        //       onPress={() => setIsRequestLeaveBottomSheetVisible(true)}
        //     />
        //   </View>
        // ),
      }
      //   });
    );
  }, [navigation]);

  const renderEmergencyContacts = () => {
    if (emergencyContacts) {
      if (emergencyContacts.length === 0) {
        return (
          <Text style={styles.emptyState}>No Emergency Contacts Present</Text>
        );
      }

      return emergencyContacts.map(
        (contact: EmergencyContact, index: number) => {
          //if phone_number and telephone_number are the same, display only one, else display both
          let displayPhones = "";
          if (contact.phone_number === contact.telephone_number) {
            displayPhones = contact.phone_number;
          } else {
            displayPhones =
              contact.phone_number + " / " + contact.telephone_number;
          }
          return (
            <View key={index} style={styles.requestRow}>
              <View
                style={[styles.dateColumn, { flexDirection: "row", flex: 1.3 }]}
              >
                <Text style={styles.buildingText}>
                  {contact.patient_name === undefined
                    ? contact.building
                    : contact.patient_name}
                </Text>
              </View>
              <View style={styles.item}>
                {displayPhones.split("/").map((phone, index) => {
                  return (
                    <Text key={index} style={styles.numberText}>
                      {phone}
                    </Text>
                  );
                })}
              </View>
              <TouchableOpacity
                onPress={() => {
                  // clear the selected contacts
                  setSelectedContacts([]);

                  if (
                    contact.phone_number !== undefined &&
                    contact.phone_number !== null &&
                    contact.phone_number !== ""
                  ) {
                    setSelectedContacts((prev) => [
                      ...prev,
                      contact.phone_number,
                    ]);
                  }

                  bottomSheetModalRef.current?.present();
                }}
              >
                <MaterialIcons name="phone" size={30} color={"darkorange"} />
              </TouchableOpacity>
            </View>
          );
        }
      );
    }
  };

  const makePhoneCall = async (number: string) => {
    let phoneNumber = "";

    if (Platform.OS === "android") {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }

    try {
      const supported = await Linking.canOpenURL(phoneNumber);
      if (!supported) {
        console.log("Provided phone number is not available");
      } else {
        await Linking.openURL(phoneNumber);
      }
    } catch (error) {
      console.error("Failed to open URL", error);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <SafeAreaView
        style={[styles.container, { marginTop: headerHeight + 10 }]}
      >
        <StatusBar style="dark" />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.requestHeader}>
            <Text style={[styles.itemHeader, { flex: 1.2 }]}>
              {t("emergencyContact.headers.patient")}
              {/* {"・"}
              {t("emergencyContact.headers.place")} */}
            </Text>
            <Text style={[styles.itemHeader, { flex: 1.2 }]}>
              {t("emergencyContact.headers.contact")}
            </Text>
            <Text style={{ flex: 0.2 }}></Text>
          </View>

          {renderEmergencyContacts()}
        </ScrollView>
      </SafeAreaView>
      <CustomButtomSheetModal
        onClose={() => {
          dismiss();
        }}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["20%, 50%"]}
        // headerText="Call"
        enablePanDownToClose={true}
      >
        <View style={styles.bottomSheetContent}>
          {/* <Text style={styles.bottomSheetHeader}>Make a Call</Text> */}
          {selectedContacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={styles.callButton}
              onPress={() => {
                // setSelectedContacts([]);
                makePhoneCall(contact);
              }} // Implement this function as needed
            >
              <Text style={styles.callButtonText}> {contact}</Text>
              {/* <MaterialIcons
                name="phone"
                size={20}
                color={theme.colors.primary}
              /> */}
            </TouchableOpacity>
          ))}

          {/* <TouchableOpacity
            style={[styles.callButton, styles.cancelButton]}
            onPress={() => dismiss()} // This hides the modal
          >
            <Text style={styles.callButtonText}>Cancel</Text>
          </TouchableOpacity> */}
        </View>
      </CustomButtomSheetModal>
    </>
  );
};

export default EmergencyContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  requestHeader: {
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestRow: {
    // margin: 20,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemHeader: {
    flex: 1, // Adjusted for alignment
    fontSize: 20,
    textAlign: "left", // Ensure alignment with row content
    fontWeight: "bold",
  },
  item: {
    flex: 1.5, // Make sure this matches the flex in headers for alignment
    flexDirection: "column",
    marginLeft: 20,
  },
  dateColumn: {
    // flex: 1
    // textAlign: "left",
    justifyContent: "flex-start",
  },
  dateLabel: {
    fontSize: 16,
    color: "#333333",
  },
  dateText: {
    fontSize: 18,
    color: "#333333",
    // marginLeft: 5,
    marginVertical: 5,
    fontWeight: "bold",
  },
  typeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    // marginBottom: 5,
    marginLeft: 20,
  },
  emptyState: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  buildingText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginRight: 10,
  },
  numberText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  // bottomsheet
  bottomSheetContent: {
    padding: 10,
    width: "100%",
  },
  // bottomSheetHeader: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   marginBottom: 20,
  // },
  callButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "lightgrey", // Use your theme color or adjust as needed
    borderRadius: 10,
    // width: "",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  callButtonText: {
    fontSize: 24,
    color: "black", // Adjust based on your theme
  },
  cancelButton: {
    // backgroundColor: "#FF6347", // A red color for the cancel button, adjust as needed
    marginTop: 10, // Add some space above the cancel button
  },
});
