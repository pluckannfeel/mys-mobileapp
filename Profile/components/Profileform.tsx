import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Profile } from "../types/profile";
import * as Yup from "yup";
import { Field, useFormik } from "formik";
import { HEIGHT } from "../../core/constants/dimensions";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../core/theme/theme";
import { useTranslation } from "react-i18next";
import ProfileImageWithFab from "./ProfileImageWithFab";
import PopupMenu from "../../core/Components/PopupMenu";
import ProfileView from "./ProfileView";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { convertToBase64, openSettings } from "../../core/helpers/functions";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import CustomButtomSheetModal from "../../core/Components/CustomBottomSheetModal";
import Files from "./Files";
import { FileItem } from "../types/profile";

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

type ProfileProps = {
  saveProfile: (values: Profile) => void;
  profileData: Profile;
};

type ProfileImageState = string | null;

const Profileform: React.FC<ProfileProps> = ({ saveProfile, profileData }) => {
  const { t } = useTranslation();
  // const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [isProfileViewVisible, setProfileViewVisible] =
    useState<boolean>(false);
  const [image, setImage] = useState<ProfileImageState>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  console.log("profileData", profileData);

  const passport_details = JSON.parse(profileData.passport_details as string);
  const residence_card_details = JSON.parse(
    profileData.residence_card_details as string
  );
  const bank_card_images = JSON.parse(profileData.bank_card_images as string);

  const files: FileItem[] = [
    {
      id: "1",
      file_type: "passport",
      url: passport_details["file"],
    },
    {
      id: "2",
      file_type: "residence_card_front",
      url: residence_card_details["front"] as string,
    },
    {
      id: "3",
      file_type: "residence_card_back",
      url: residence_card_details["back"] as string,
    },
    {
      id: "4",
      file_type: "bank_card_front",
      url: bank_card_images["front"] as string,
    },

    // {
    //   id: "3",
    //   file_type: "residence_card_back",
    //   url: profileData.img_url as string,
    // },
  ];

  //bottom sheet (this will replace the menu items)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // to dismiss the bottom sheet modal
  const { dismiss } = useBottomSheetModal();

  const initialValues: Profile = {
    ...profileData,
    img_url: profileData.img_url,
    // add some conversions with data here if necessary
  };

  const validationSchema = Yup.object().shape({
    // add validation here
  });

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      saveProfile(
        // add some conversions with data here if necessary
        {
          ...values,
          img_url: image as string,
        }
      );
    },
    validationSchema,
  });

  // const openMenuItemHandler = () => {
  //   setMenuVisible(true);
  // };

  const openBottomSheetModalHandler = () => {
    bottomSheetModalRef.current?.present();
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    };
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "This app requires access to your media library to select photos. Please go to your settings and enable media library access for this app.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: openSettings },
        ]
      );
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync(options);

    if (!pickerResult.canceled && pickerResult.assets[0].uri) {
      console.log("Photo URI:", pickerResult.assets[0].uri);
      // setImage(await convertToBase64(pickerResult.assets[0].uri));
      setImage(pickerResult.assets[0].uri);
    }
  };

  const selectFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.75,
    };

    if (!permissionResult.granted) {
      alert(t("common.permissionDenied"));
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync(options);

    if (!pickerResult.canceled && pickerResult.assets[0].uri) {
      console.log(pickerResult.assets[0].uri);
      // saveImage(result.assets[0].uri);
      // setImage(await convertToBase64(pickerResult.assets[0].uri));
      setImage(pickerResult.assets[0].uri);
    }
  };

  // const saveImage = async (uri: string) => {
  //   await ensureDirExists();

  //   const filename = new Date().getTime() + ".jpg";

  //   const dest = imgDir + filename;

  //   await FileSystem.copyAsync({
  //     from: uri,
  //     to: dest,
  //   });
  // };

  const menuOptions = [
    {
      text: t("profile.form.avatar.actions.takePhoto"),
      onPress: takePhoto,
    },
    {
      text: t("profile.form.avatar.actions.selectFromGallery"),
      onPress: selectFromGallery,
    },
  ];

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <ProfileImageWithFab
          // imageUrl={formik.values.img_url as string}
          imageUrl={image || (formik.values.img_url as string)}
          onImagePress={() => {
            setCurrentImageUrl(formik.values.img_url as string);
            setProfileViewVisible(true);
          }}
          onFabPress={openBottomSheetModalHandler}
        />
        <Text style={styles.name}>{formik.values.english_name}</Text>
        <Text style={styles.role}>{formik.values.job_position}</Text>

        {/* Japanese Name Field */}
        <View style={styles.inputContainer}>
          <TextInput
            // as={TextInput}
            // name="japanese_name"
            onChangeText={formik.handleChange("japanese_name")}
            onBlur={formik.handleBlur("japanese_name")}
            value={formik.values.japanese_name}
            placeholder={t("profile.form.japanese_name.label")}
            style={styles.input}
          />
          <Text style={styles.inputLabel}>{"名前"}</Text>
          {/* <Ionicons name="mail-outline" size={24} color="#f43f5e" /> */}
          {formik.touched.japanese_name && formik.errors.japanese_name && (
            <Text style={styles.errorText}>{formik.errors.japanese_name}</Text>
          )}
        </View>

        {/* Nickname Field */}
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={formik.handleChange("nickname")}
            onBlur={formik.handleBlur("nickname")}
            value={formik.values.nickname}
            placeholder={t("profile.form.nickname.label")}
            style={styles.input}
          />
          <Text style={styles.inputLabel}>{"ニックネーム"}</Text>
          {/* <Ionicons name="mail-outline" size={24} color="#f43f5e" /> */}
          {formik.touched.nickname && formik.errors.nickname && (
            <Text style={styles.errorText}>{formik.errors.nickname}</Text>
          )}
        </View>

        {/* phone Field */}
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={formik.handleChange("phone_number")}
            onBlur={formik.handleBlur("phone_number")}
            value={formik.values.phone_number}
            placeholder={t("profile.form.phone_number.label")}
            style={styles.input}
          />
          {/* <Text style={styles.inputLabel}>{"カナ"}</Text> */}
          <Ionicons name="call-outline" size={24} color="#f43f5e" />
          {formik.touched.phone_number && formik.errors.phone_number && (
            <Text style={styles.errorText}>{formik.errors.phone_number}</Text>
          )}
        </View>

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={formik.handleChange("personal_email")}
            onBlur={formik.handleBlur("personal_email")}
            value={formik.values.personal_email}
            placeholder={t("profile.form.email.label")}
            style={styles.input}
          />

          <Ionicons name="mail-outline" size={24} color="#f43f5e" />
          {formik.touched.personal_email && formik.errors.personal_email && (
            <Text style={styles.errorText}>{formik.errors.personal_email}</Text>
          )}
        </View>

        {/* ... other fields ... */}

        <Files
          files={files}
          onAddFile={() => {
            console.log("add file");
          }}
          onViewFile={(url) => {
            setCurrentImageUrl(url);
            setProfileViewVisible(true); // Open the ProfileView when a file is clicked
          }}
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={() => formik.handleSubmit()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* <PopupMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        menuOptions={menuOptions}
      /> */}
      <CustomButtomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={["35%"]}
        headerText={t("profile.form.avatar.actions.label")}
      >
        <View style={styles.modalContent}>
          {menuOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                item.onPress();
                // bottomSheetModalRef.current?.close();
                dismiss();
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </CustomButtomSheetModal>

      <ProfileView
        imageUrl={currentImageUrl as string}
        isVisible={isProfileViewVisible}
        onClose={() => setProfileViewVisible(false)}
      />
    </KeyboardAvoidingView>
    // </TouchableWithoutFeedback>
  );
};

// avatar actions

export default Profileform;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    marginTop: HEIGHT / 10,
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  role: {
    fontSize: 18,
    textAlign: "center",
    color: "#666",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#f43f5e",
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
  button: {
    backgroundColor: "#f43f5e",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  // modal children
  modalContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  modalButton: {
    width: 140, // Adjust width and height as needed
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.pink400, // You can change the background color
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // for Android
  },
  modalButtonText: {
    textAlign: "center",
    // Add any additional styling for the text here
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
