import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  NativeSyntheticEvent,
  TextInputFocusEventData,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { AddDocumentProps, PassportDetails, Profile } from "../types/profile";
import * as Yup from "yup";
import { Field, useFormik } from "formik";
import { HEIGHT, width } from "../../core/constants/dimensions";
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
import { he, is } from "date-fns/locale";
import { DropdownSelect } from "../../core/Components/DropdownSelect";
import colors from "../../core/theme/colors";
import { useMunicipalities } from "../hooks/useAddressMunicipalities";
import { usePostalCodes } from "../hooks/useAddressPostalCode";
import { usePrefectures } from "../hooks/useAddressPrefectures";
import { PostalCode } from "../types/address";
import {
  filterMunicipalitiesByPrefecture,
  getAddressByPostalCode,
} from "../../Notifications/helpers/helper";
import Loader from "../../core/Components/Loader";
import { useAuth } from "../../auth/contexts/AuthProvider";

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

type ProfileProps = {
  saveProfile: (values: Profile) => void;
  addDocument: (values: AddDocumentProps) => void;
  profileData: Profile;
  refetchProfileData: () => void;
};

type ProfileImageState = string | null;

const Profileform: React.FC<ProfileProps> = ({
  saveProfile,
  addDocument,
  profileData,
  refetchProfileData,
}) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  // const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [isProfileViewVisible, setProfileViewVisible] =
    useState<boolean>(false);
  const [isDocument, setIsDocument] = useState<boolean>(false);
  const [documentType, setDocumentType] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<ProfileImageState>(null);
  const [documentImage, setDocumentImage] = useState<ProfileImageState>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your data fetching logic here.
      if (refetchProfileData) refetchProfileData();
    } catch (error) {
      console.error("Error refreshing notifications", error);
    } finally {
      // Wait for 3 seconds before setting refreshing to false
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [refetchProfileData]);

  const [selectedPrefecture, setSelectedPrefecture] = useState<
    string | undefined
  >(profileData?.prefecture);

  const { isLoading: isPrefectureDataLoading, data: prefectures } =
    usePrefectures();
  const { isLoading: isMunicipalityDataLoading, data: municipalities } =
    useMunicipalities();
  const { isLoading: isPostalCodeDataLoading, data: postalCodes } =
    usePostalCodes();
  // State for overall loading status
  const [isOverallLoading, setIsOverallLoading] = useState(true);

  useEffect(() => {
    if (
      (profileData && isPrefectureDataLoading) ||
      isMunicipalityDataLoading ||
      isPostalCodeDataLoading
    ) {
      setIsOverallLoading(true);
    } else {
      setIsOverallLoading(false);
    }
  }, [
    isPrefectureDataLoading,
    isMunicipalityDataLoading,
    isPostalCodeDataLoading,
  ]);

  const document_types = [
    {
      label: "profile.form.documents.options.passport",
      value: "passport",
    },
    {
      label: "profile.form.documents.options.residence_card_front",
      value: "residence_card_front",
    },
    {
      label: "profile.form.documents.options.residence_card_back",
      value: "residence_card_back",
    },
    {
      label: "profile.form.documents.options.bank_card_front",
      value: "bank_card_front",
    },
    {
      label: "profile.form.documents.options.bank_card_back",
      value: "bank_card_back",
    },
  ];

  // Function to safely parse JSON strings within the profile data
  const parseJSON = (jsonString: string): any => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return null;
    }
  };

  // Parse the JSON strings to objects
  const bankCardDetails = parseJSON(profileData.bank_card_images as string);
  const passportDetails = parseJSON(profileData.passport_details as string);
  const residenceCardDetails = parseJSON(
    profileData.residence_card_details as string
  );

  // File types and their corresponding key in the details object
  const fileTypes = [
    { type: "passport", key: "file", details: passportDetails },
    {
      type: "residence_card_front",
      key: "front",
      details: residenceCardDetails,
    },
    { type: "residence_card_back", key: "back", details: residenceCardDetails },
    { type: "bank_card_front", key: "front", details: bankCardDetails },
    { type: "bank_card_back", key: "back", details: bankCardDetails },
  ];

  // Generate the files array dynamically
  const files: FileItem[] = fileTypes
    .map((file, index) => {
      const url =
        file.details && file.details[file.key] ? file.details[file.key] : null;
      return url
        ? {
            id: (index + 1).toString(),
            file_type: file.type as FileItem["file_type"],
            url,
          }
        : null;
    })
    .filter((file): file is FileItem => file !== null);

  // console.log(files);

  //bottom sheet (this will replace the menu items)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // to dismiss the bottom sheet modal
  const { dismiss } = useBottomSheetModal();

  const initialValues: Profile = {
    ...profileData,
    img_url: profileData.img_url,
    // add some conversions with data here if necessary
    residence_card_details: residenceCardDetails,
    bank_card_images: bankCardDetails,
    passport_details: passportDetails,
  };

  const validationSchema = Yup.object().shape({
    // add validation here
  });

  // console.log(initialValues)

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      // console.log(values);
      saveProfile(
        // add some conversions with data here if necessary
        {
          ...values,
          img_url: profileImage as string,
        }
      );
    },
    validationSchema,
  });

  // postal code, address
  // postal code blur
  const handlePostalCodeBlur = (
    e: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    const postalCode = e.nativeEvent.text;

    // console.log("postalCode", postalCode);

    const completeAddress: PostalCode[] | undefined = getAddressByPostalCode(
      postalCodes,
      postalCode
    );
    // set prefecture, municipality, town value
    if (completeAddress && completeAddress.length > 0) {
      // check if completeAddress[0].jp_prefecture if not dont set

      setSelectedPrefecture(completeAddress[0].jp_prefecture);
      formik.setFieldValue("prefecture", completeAddress[0].jp_prefecture);
      formik.setFieldValue("municipality", completeAddress[0].jp_municipality);
      if (currentLanguage === "ja")
        formik.setFieldValue("town", completeAddress[0].jp_town);
    }
  };

  // add document handler
  const addDocumentHandler = () => {
    addDocument({
      staff_id: profileData.id,
      documentType: documentType as string,
      documentImage: documentImage as string,
    });
    // bottomSheetModalRef.current?.close();
    dismiss();
  };

  // const openMenuItemHandler = () => {
  //   setMenuVisible(true);
  // };

  const profileImageOpenBottomSheetModalHandler = () => {
    setIsDocument(false);
    bottomSheetModalRef.current?.present();
  };

  const addDocumentOpenBottomSheetModalHandler = () => {
    setIsDocument(true);
    bottomSheetModalRef.current?.present();
  };

  // ================================ image handlers ================================
  const takePhoto = async (uploadType: string) => {
    if (uploadType === "document" && !documentType) {
      Alert.alert(
        t("profile.form.documents.type.alert.title"),
        t("profile.form.documents.type.alert.message")
      );

      return;
    }

    // check if document type is not null
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
      // console.log("Photo URI:", pickerResult.assets[0].uri);
      // setImage(await convertToBase64(pickerResult.assets[0].uri));
      if (uploadType === "profile") {
        setProfileImage(pickerResult.assets[0].uri);
      } else {
        setDocumentImage(pickerResult.assets[0].uri);
      }
    }
  };

  const selectFromGallery = async (uploadType: string) => {
    if (uploadType === "document" && !documentType) {
      Alert.alert(
        t("profile.form.documents.type.alert.title"),
        t("profile.form.documents.type.alert.message")
      );

      return;
    }

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
      // console.log(pickerResult.assets[0].uri);
      // saveImage(result.assets[0].uri);
      // setImage(await convertToBase64(pickerResult.assets[0].uri));

      if (uploadType === "profile") {
        setProfileImage(pickerResult.assets[0].uri);
      } else {
        setDocumentImage(pickerResult.assets[0].uri);
      }
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

  const changeProfileImageMenuOptions = [
    {
      text: t("profile.form.avatar.actions.takePhoto"),
      onPress: () => takePhoto("profile"),
    },
    {
      text: t("profile.form.avatar.actions.selectFromGallery"),
      onPress: () => selectFromGallery("profile"),
    },
  ];

  const addDocumentImageMenuOptions = [
    {
      text: t("profile.form.avatar.actions.takePhoto"),
      onPress: () => takePhoto("document"),
    },
    {
      text: t("profile.form.avatar.actions.selectFromGallery"),
      onPress: () => selectFromGallery("document"),
    },
  ];

  const bottomSheetModalSnapPoint = isDocument
    ? [!documentImage ? "40" : "65%"]
    : ["35%"];

  // Component render
  return (
    <>
      {isOverallLoading ? (
        // <Loader /> // Your Loader component
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: theme.colors.secondary,
          }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        // <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        // </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 160 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <ProfileImageWithFab
              // imageUrl={formik.values.img_url as string}
              imageUrl={profileImage || (formik.values.img_url as string)}
              onImagePress={() => {
                setCurrentImageUrl(formik.values.img_url as string);
                setProfileViewVisible(true);
              }}
              onFabPress={profileImageOpenBottomSheetModalHandler}
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
                placeholderTextColor={"#666"}
                style={styles.input}
              />
              <Text style={styles.inputLabel}>{"名前"}</Text>
              {/* <Ionicons name="mail-outline" size={24} color="#f43f5e" /> */}
              {formik.touched.japanese_name && formik.errors.japanese_name && (
                <Text style={styles.errorText}>
                  {formik.errors.japanese_name}
                </Text>
              )}
            </View>

            {/* english Name Field */}
            <View style={styles.inputContainer}>
              <TextInput
                // as={TextInput}
                // name="japanese_name"
                onChangeText={formik.handleChange("english_name")}
                onBlur={formik.handleBlur("english_name")}
                value={formik.values.english_name}
                placeholder={t("profile.form.english_name.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />
              <Text style={styles.inputLabel}>{"NAME"}</Text>
              {/* <Ionicons name="mail-outline" size={24} color="#f43f5e" /> */}
              {formik.touched.english_name && formik.errors.english_name && (
                <Text style={styles.errorText}>
                  {formik.errors.english_name}
                </Text>
              )}
            </View>

            {/* Nickname Field */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("nickname")}
                onBlur={formik.handleBlur("nickname")}
                value={formik.values.nickname}
                placeholder={t("profile.form.nickname.label")}
                placeholderTextColor={"#666"}
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
                placeholderTextColor={"#666"}
                style={styles.input}
              />
              {/* <Text style={styles.inputLabel}>{"カナ"}</Text> */}
              <Ionicons name="call-outline" size={24} color="#f43f5e" />
              {formik.touched.phone_number && formik.errors.phone_number && (
                <Text style={styles.errorText}>
                  {formik.errors.phone_number}
                </Text>
              )}
            </View>

            {/* Email Field */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("personal_email")}
                onBlur={formik.handleBlur("personal_email")}
                value={formik.values.personal_email}
                placeholder={t("profile.form.personal_email.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              <Ionicons name="mail-outline" size={24} color="#f43f5e" />
              {formik.touched.personal_email &&
                formik.errors.personal_email && (
                  <Text style={styles.errorText}>
                    {formik.errors.personal_email}
                  </Text>
                )}
            </View>

            {/* Email Field */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("work_email")}
                onBlur={formik.handleBlur("work_email")}
                value={formik.values.work_email}
                placeholder={t("profile.form.work_email.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              <Ionicons name="mail-outline" size={24} color="#f43f5e" />
              {formik.touched.work_email && formik.errors.work_email && (
                <Text style={styles.errorText}>{formik.errors.work_email}</Text>
              )}
            </View>

            {/* Address Header text  */}
            <Text
              style={[styles.inputLabel, { marginVertical: 5, fontSize: 22 }]}
            >
              {t("profile.form.address.label")}
            </Text>

            {/* Postal Code Field */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("postal_code")}
                // onBlur={}
                onBlur={handlePostalCodeBlur}
                value={formik.values.postal_code}
                placeholder={t("profile.form.postal_code.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              <Text style={styles.inputLabel}>{"〒"}</Text>
              {formik.touched.postal_code && formik.errors.postal_code && (
                <Text style={styles.errorText}>
                  {formik.errors.postal_code}
                </Text>
              )}
            </View>

            {/* Prefecture */}
            <View style={[styles.inputContainer]}>
              <DropdownSelect
                placeholderColor="#666"
                label={t("profile.form.prefecture.label")}
                // style={[styles.dropdownContainer, { marginVertical: 20 }]}
                style={[
                  styles.dividerInput,
                  { paddingHorizontal: 5, width: "100%" },
                ]}
                name="prefecture"
                value={formik.values.prefecture}
                items={prefectures!.map((type) => ({
                  value: type.jp_prefecture,
                  label:
                    currentLanguage === "ja"
                      ? type.jp_prefecture
                      : type.en_prefecture, // Apply translation here
                }))}
                onValueChange={(value, name) => {
                  // formik.handleChange(name)(value);
                  formik.setFieldValue(name, value);

                  setSelectedPrefecture(value);
                }}
              />
            </View>

            {/* Municipality */}
            <View style={[styles.inputContainer]}>
              <DropdownSelect
                placeholderColor="#666"
                label={t("profile.form.municipality.label")}
                // style={[styles.dropdownContainer, { marginVertical: 20 }]}
                style={[
                  styles.dividerInput,
                  { paddingHorizontal: 5, width: "100%" },
                ]}
                name="municipality"
                value={formik.values.municipality}
                items={filterMunicipalitiesByPrefecture(
                  municipalities,
                  selectedPrefecture
                )!.map((type) => ({
                  value: type.jp_municipality,
                  label:
                    currentLanguage === "ja"
                      ? type.jp_municipality
                      : type.en_municipality, // Apply translation here
                }))}
                onValueChange={(value, name) => {
                  formik.handleChange(name)(value);
                  // console.log("value", value);
                  // formik.setFieldValue(name, value);
                }}
              />
            </View>

            {/* Town */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("town")}
                value={formik.values.town}
                placeholder={t("profile.form.town.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              {/* <Text style={styles.inputLabel}>{"〒"}</Text> */}
              {formik.touched.town && formik.errors.town && (
                <Text style={styles.errorText}>{formik.errors.town}</Text>
              )}
            </View>

            {/* Town */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("building")}
                value={formik.values.building}
                placeholder={t("profile.form.building.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              {/* <Text style={styles.inputLabel}>{"〒"}</Text> */}
              {formik.touched.building && formik.errors.building && (
                <Text style={styles.errorText}>{formik.errors.building}</Text>
              )}
            </View>

            {/* Bank Information Header  */}
            <Text
              style={[
                styles.inputLabel,
                { marginVertical: 5, marginBottom: 10, fontSize: 22 },
              ]}
            >
              {t("profile.form.bank_details.label")}
            </Text>

            {/* Bank Name */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("bank_name")}
                value={formik.values.bank_name}
                placeholder={t("profile.form.bank_name.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              {/* <Text style={styles.inputLabel}>{"〒"}</Text> */}
              {formik.touched.bank_name && formik.errors.bank_name && (
                <Text style={styles.errorText}>{formik.errors.bank_name}</Text>
              )}
            </View>

            {/* branch Name */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("branch_name")}
                value={formik.values.branch_name}
                placeholder={t("profile.form.branch_name.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              {/* <Text style={styles.inputLabel}>{"〒"}</Text> */}
              {formik.touched.branch_name && formik.errors.branch_name && (
                <Text style={styles.errorText}>
                  {formik.errors.branch_name}
                </Text>
              )}
            </View>

            {/* account type */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("account_type")}
                value={formik.values.account_type}
                placeholder={t("profile.form.account_type.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              {/* <Text style={styles.inputLabel}>{"〒"}</Text> */}
              {formik.touched.account_type && formik.errors.account_type && (
                <Text style={styles.errorText}>
                  {formik.errors.account_type}
                </Text>
              )}
            </View>

            {/* account_number */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("account_number")}
                value={formik.values.account_number}
                placeholder={t("profile.form.account_number.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              {/* <Text style={styles.inputLabel}>{"〒"}</Text> */}
              {formik.touched.account_number &&
                formik.errors.account_number && (
                  <Text style={styles.errorText}>
                    {formik.errors.account_number}
                  </Text>
                )}
            </View>

            {/* account_name */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("account_name")}
                value={formik.values.account_name}
                placeholder={t("profile.form.account_name.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              {/* <Text style={styles.inputLabel}>{"〒"}</Text> */}
              {formik.touched.account_name && formik.errors.account_name && (
                <Text style={styles.errorText}>
                  {formik.errors.account_name}
                </Text>
              )}
            </View>

            {/* Bank Information Header  */}
            <Text
              style={[
                styles.inputLabel,
                { marginVertical: 5, marginBottom: 10, fontSize: 22 },
              ]}
            >
              {t("profile.form.passport_details.label") +
                " / " +
                t("profile.form.residence_card_details.label")}
            </Text>

            {/* passport_number */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange("passport_details.number")}
                value={formik.values.passport_details?.number}
                placeholder={t("profile.form.passport_number.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              {/* <Text style={styles.inputLabel}>{"〒"}</Text> */}
              {formik.touched.passport_details &&
                formik.errors.passport_details && (
                  <Text style={styles.errorText}>
                    {formik.errors.passport_details}
                  </Text>
                )}
            </View>

            {/* residence_card_number */}
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={formik.handleChange(
                  "residence_card_details.residence_card_number"
                )}
                // onChange={(e) => {
                //   // convert to object residence_card_details
                //   // if(profileData.residence_card_details) {
                //   //   const details = JSON.parse(profileData.residence_card_details as string)

                //   //   formik.setFieldValue("residence_card_details", {
                //   //     ...details,
                //   //     number: e.nativeEvent.text,
                //   //   });
                //   // }else {
                //   //   formik.setFieldValue("residence_card_details", {
                //   //     number: e.nativeEvent.text,
                //   //   });
                //   // }
                // }}
                value={formik.values.residence_card_details?.number}
                placeholder={t("profile.form.residence_card_number.label")}
                placeholderTextColor={"#666"}
                style={styles.input}
              />

              {/* <Text style={styles.inputLabel}>{"〒"}</Text> */}
              {formik.touched.residence_card_details &&
                formik.errors.residence_card_details && (
                  <Text style={styles.errorText}>
                    {formik.errors.residence_card_details}
                  </Text>
                )}
            </View>

            <Files
              files={files}
              onAddFile={addDocumentOpenBottomSheetModalHandler}
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
              <Text style={styles.buttonText}>{t("profile.actions.save")}</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* <PopupMenu
  visible={menuVisible}
  onClose={() => setMenuVisible(false)}
  menuOptions={menuOptions}
/> */}
          <CustomButtomSheetModal
            onClose={() => dismiss()}
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={bottomSheetModalSnapPoint}
            headerText={
              isDocument
                ? t("profile.form.documents.actions.add")
                : t("profile.form.avatar.actions.label")
            }
          >
            {/* this part, if the the current selection is document, it shows document form, else profile image upload */}
            {isDocument ? (
              <>
                <View style={[styles.dropdownContainer]}>
                  <DropdownSelect
                    placeholderColor="#666"
                    label={t("profile.form.documents.type.label")}
                    // style={[styles.dropdownContainer, { marginVertical: 20 }]}
                    style={[styles.dividerInput]}
                    name="document_type"
                    value={documentType as string}
                    items={document_types.map((type) => ({
                      value: type.value,
                      label: t(type.label), // Apply translation here
                    }))}
                    onValueChange={(value, name) => {
                      // formik.setFieldValue(name, value);
                      setDocumentType(value);
                    }}
                  />
                </View>
                <View style={[styles.modalContent]}>
                  {/* this part, if the the document image is selected, the upload menu options disappears then change to image name and buttons to view and save the document*/}
                  {documentImage ? (
                    <View style={styles.documentForm}>
                      <Image
                        source={{ uri: documentImage }}
                        style={styles.image}
                        // resizeMode="contain"
                        resizeMode="contain"
                      />

                      <View style={styles.buttonGroupContainer}>
                        <TouchableOpacity
                          onPress={() => {
                            setDocumentImage(null);
                          }}
                          style={[
                            styles.buttonStyle,
                            {
                              backgroundColor: "#fff",
                              borderWidth: 1,
                              borderColor: theme.colors.pink500,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.buttonText,
                              { color: theme.colors.pink500 },
                            ]}
                          >
                            {t("profile.form.documents.actions.change")}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={addDocumentHandler}
                          style={styles.buttonStyle}
                        >
                          <Text style={styles.buttonText}>
                            {t("profile.form.documents.actions.save")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    addDocumentImageMenuOptions.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          item.onPress();
                          // bottomSheetModalRef.current?.close();
                          // dismiss();
                        }}
                        style={styles.modalButton}
                      >
                        <Text style={styles.modalButtonText}>{item.text}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </>
            ) : (
              <View style={styles.modalContent}>
                {changeProfileImageMenuOptions.map((item, index) => (
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
            )}
          </CustomButtomSheetModal>

          <ProfileView
            imageUrl={currentImageUrl as string}
            isVisible={isProfileViewVisible}
            onClose={() => setProfileViewVisible(false)}
          />
        </KeyboardAvoidingView>
      )}
    </>
  );
};

// avatar actions

export default Profileform;

const styles = StyleSheet.create({
  // modal children
  modalContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // marginTop: 10,
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
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    marginTop: HEIGHT / 10,
    padding: 20,
  },
  dropdownContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: "#000",
    borderRadius: 5,
    color: "#000",
    borderColor: theme.colors.pink500,
    // color:
    paddingVertical: 15,
    width: "80%",
  },
  dividerInput: {
    fontSize: 18,
    // paddingVertical: 5,
    paddingHorizontal: 10,
    // marginHorizontal: 20,
    // flex: 1,
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
    fontSize: 18,
    marginRight: 10,
    marginLeft: 5,
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
    fontSize: 20,
  },
  buttonGroupContainer: {
    alignItems: "center", // Center the buttons horizontally
    justifyContent: "space-around", // Center the buttons vertically (if there's extra space)
    flexDirection: "row", // Arrange buttons in a column
  },
  buttonStyle: {
    backgroundColor: "#f43f5e",
    padding: 15,
    borderRadius: 8,
    alignItems: "center", // Center the text inside the button
    marginTop: 10, // Add some margin at the top of each button
    width: 150, // Define a fixed width for the buttons
  },
  // document
  documentForm: {
    width: "100%",
    // height: "100%",
    height: "100%",
    // marginVertical: 20,
  },
  image: {
    marginVertical: 20,
    // flex: 1,
    width: "100%",
    height: 300,
  },
});
