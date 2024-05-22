import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  // KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { OutgoingAssistanceRecord, ShiftReport } from "../types/Shift";
import { ScrollView } from "react-native-gesture-handler";
import {
  support_hours,
  transport_types,
  meal_frequencies,
  bath_types,
} from "../helpers/pickerOptions";
import ReportRadioGroup from "./ReportRadioButton";
import { useTranslation } from "react-i18next";
import { theme } from "../../core/theme/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DropdownSelect } from "../../core/Components/DropdownSelect";

interface ReportFormProps {
  submitForm: (values: ShiftReport) => void;
  info: ShiftReport;
}

// const validationSchema = Yup.object().shape({
//   service_hours: Yup.string().required("Service hours are required"),
//   diaper_change: Yup.string().required("Physical caregiving is required"),
//   // Add other field validations as needed
// });

const ShiftReportForm: React.FC<ReportFormProps> = ({ submitForm, info }) => {
  const { t } = useTranslation();

  // useEffect(() => {
  //   console.log(info);
  // }, [info]);

  const initialValues: Partial<ShiftReport> = {
    shift_id: info.shift_id,
    patient: info.patient,
    service_hours: info.service_hours,
    toilet_assistance: info.toilet_assistance,
    // toilet_assistance: {
    //   toilet: info.toilet_assistance?.toilet ? true : false,
    //   diaper_change: info.toilet_assistance?.diaper_change ? true : false,
    //   linen_change: info.toilet_assistance?.linen_change ? true : false,
    //   urinal_flushing: info.toilet_assistance?.urinal_flushing ? true : false,
    // },
    meal_assistance: info.meal_assistance,
    bath_assistance: info.bath_assistance,
    grooming_assistance: info.grooming_assistance,
    positioning_assistance: info.positioning_assistance,
    medication_medical_care: info.medication_medical_care,
    daily_assistance: info.daily_assistance,
    outgoing_assistance: info.outgoing_assistance,
  };

  const formik = useFormik({
    initialValues,
    // validationSchema,
    // onSubmit,
    onSubmit: (values) => {
      submitForm(values as ShiftReport);
      // console.log(values)
    },
  });

  // outgoing transportation assistance record
  const handleAddOutgoingAssistanceRecord = () => {
    formik.setFieldValue("outgoing_assistance", [
      ...(formik.values.outgoing_assistance ?? []),
      {
        // desitnation
        // support hours
        // transport_type
      },
    ]);
  };

  const handleRemoveOutgoingAssistanceRecord = (index: number) => {
    const record = [...(formik.values.outgoing_assistance ?? [])];
    record.splice(index, 1);
    formik.setFieldValue("outgoing_assistance", record);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    {/* <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    > */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Simplified Input Fields */}
        <View style={styles.dividerContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={theme.colors.pink400}
            />
            <Text style={styles.header}>
              {t("shift.shiftReport.form.sections.patient")}
            </Text>
          </View>
          <TextInput
            style={styles.dividerInput}
            onChangeText={formik.handleChange("patient")}
            onBlur={formik.handleBlur("patient")}
            value={formik.values.patient}
          />
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={24}
              color={theme.colors.pink400}
            />
            <Text style={styles.header}>
              {t("shift.shiftReport.form.sections.serviceHours")}
            </Text>
          </View>
          <TextInput
            style={styles.dividerInput}
            onChangeText={formik.handleChange("service_hours")}
            onBlur={formik.handleBlur("service_hours")}
            value={formik.values.service_hours}
          />
        </View>

        {/* Implement Select and Checkbox similarly */}

        {/* Toilet Assistance Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="toilet"
            size={24}
            color={theme.colors.pink400}
          />
          <Text style={styles.header}>
            {t("shift.shiftReport.form.sections.toilet")}
          </Text>
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.toilet_assistance.toilet")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.toilet_assistance?.toilet}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("toilet_assistance.toilet", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>{t("shift.shiftReport.form.toilet_assistance.diaper")}</Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.toilet_assistance?.diaper_change}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "toilet_assistance.diaper_change",
                isChecked
              );
            }}
          />
        </View>
        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.toilet_assistance.linen")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.toilet_assistance?.linen_change}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("toilet_assistance.linen_change", isChecked);
            }}
          />
        </View>
        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.toilet_assistance.urinal")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.toilet_assistance?.urinal_flushing}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "toilet_assistance.urinal_flushing",
                isChecked
              );
            }}
          />
        </View>

        {/* Meal Assistance Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="food-fork-drink"
            size={24}
            color={theme.colors.pink400}
          />
          <Text style={styles.header}>
            {t("shift.shiftReport.form.sections.meal")}
          </Text>
        </View>
        {/* Repeat for each field in MealAssistance */}
        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.meal_assistance.posture")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.meal_assistance?.posture}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("meal_assistance.posture", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {" "}
            {t("shift.shiftReport.form.meal_assistance.feeding")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.meal_assistance?.feeding}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("meal_assistance.feeding", isChecked);
            }}
          />
        </View>

        {/* meal frequency */}
        <ReportRadioGroup
          name="meal_assistance.frequency" // replace with the name of your field
          options={meal_frequencies}
          formik={formik}
          headerLabel={t("shift.shiftReport.form.meal_frequencies.label")}
        />

        {/* Bath Assistance Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="shower-head"
            size={24}
            color={theme.colors.pink400}
          />
          <Text style={styles.header}>
            {t("shift.shiftReport.form.sections.bath")}
          </Text>
        </View>
        {/* Repeat for each field in BathAssistance */}
        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.bath_assistance.bath")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.bath_assistance?.bath}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("bath_assistance.bath", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.bath_assistance.shower")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.bath_assistance?.shower}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("bath_assistance.shower", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.bath_assistance.hairWash")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.bath_assistance?.hair_wash}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("bath_assistance.hair_wash", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.bath_assistance.handsArms")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.bath_assistance?.hand_arms_wash}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("bath_assistance.hand_arms_wash", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.bath_assistance.feetWash")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.bath_assistance?.feet_wash}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("bath_assistance.feet_wash", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.bath_assistance.bedBath")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.bath_assistance?.bed_bath}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("bath_assistance.bed_bath", isChecked);
            }}
          />
        </View>

        {/* meal frequency */}
        <ReportRadioGroup
          name="bath_assistance.bath_type" // replace with the name of your field
          options={bath_types}
          formik={formik}
          headerLabel={t("shift.shiftReport.form.bath_type.label")}
        />

        {/* Grooming Assistance Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="hair-dryer"
            size={24}
            color={theme.colors.pink400}
          />
          <Text style={styles.header}>
            {t("shift.shiftReport.form.sections.grooming")}
          </Text>
        </View>
        {/* Repeat for each field in GroomingAssistance */}
        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.grooming_assistance.faceWash")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.grooming_assistance?.face_wash}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("grooming_assistance.face_wash", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.grooming_assistance.toothBrush")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.grooming_assistance?.tooth_brush}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "grooming_assistance.tooth_brush",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.grooming_assistance.dressing")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.grooming_assistance?.dressing}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("grooming_assistance.dressing", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.grooming_assistance.hairBrush")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.grooming_assistance?.hair}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("grooming_assistance.hair", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.grooming_assistance.mustacheShaving")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.grooming_assistance?.mustache}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("grooming_assistance.mustache", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.grooming_assistance.nailCutting")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.grooming_assistance?.nail_cut}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("grooming_assistance.nail_cut", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.grooming_assistance.EarCleaning")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.grooming_assistance?.ear_cleaning}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "grooming_assistance.ear_cleaning",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.grooming_assistance.noseCleaning")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.grooming_assistance?.nose_cleaning}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "grooming_assistance.nose_cleaning",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.grooming_assistance.makeup")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.grooming_assistance?.make_up}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("grooming_assistance.make_up", isChecked);
            }}
          />
        </View>

        {/* Positioning Assistance Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="bed-empty"
            size={24}
            color={theme.colors.pink400}
          />
          <Text style={styles.header}>
            {t("shift.shiftReport.form.sections.positioning")}
          </Text>
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.positioning_assistance.bodyPositioning")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.positioning_assistance?.body}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("positioning_assistance.body", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t(
              "shift.shiftReport.form.positioning_assistance.gettingUpAssistance"
            )}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.positioning_assistance?.getting_up}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "positioning_assistance.getting_up",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t(
              "shift.shiftReport.form.positioning_assistance.goingSleepAssistance"
            )}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.positioning_assistance?.sleeping}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "positioning_assistance.sleeping",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t(
              "shift.shiftReport.form.positioning_assistance.transferAssistance"
            )}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.positioning_assistance?.transfer}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "positioning_assistance.transfer",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t(
              "shift.shiftReport.form.positioning_assistance.goingOutAssistance"
            )}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.positioning_assistance?.going_out}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "positioning_assistance.going_out",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t(
              "shift.shiftReport.form.positioning_assistance.readyGoingOutAssistance"
            )}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.positioning_assistance?.ready_going_out}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "positioning_assistance.ready_going_out",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t(
              "shift.shiftReport.form.positioning_assistance.receivingPatientAssistance"
            )}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.positioning_assistance?.going_back}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "positioning_assistance.going_back",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t(
              "shift.shiftReport.form.positioning_assistance.goingHospitalAssistance"
            )}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.positioning_assistance?.hospital}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "positioning_assistance.hospital",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t(
              "shift.shiftReport.form.positioning_assistance.shoppingAssistance"
            )}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.positioning_assistance?.shopping}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "positioning_assistance.shopping",
                isChecked
              );
            }}
          />
        </View>

        {/* Medication Medical Care Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="pill"
            size={24}
            color={theme.colors.pink400}
          />
          <Text style={styles.header}>
            {t("shift.shiftReport.form.sections.medicationMedicalCare")}
          </Text>
        </View>
        {/* Repeat for each field in medicationMedicalCare */}
        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t(
              "shift.shiftReport.form.medication_assistance.medicationAssistance"
            )}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={
              formik.values.medication_medical_care?.medication_assistance
            }
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "medication_medical_care.medication_assistance",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t(
              "shift.shiftReport.form.medication_assistance.medicationApplication"
            )}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={
              formik.values.medication_medical_care?.medication_application
            }
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "medication_medical_care.medication_application",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.medication_assistance.eyedrops")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.medication_medical_care?.eye_drops}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "medication_medical_care.eye_drops",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.medication_assistance.phlegmSuction")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.medication_medical_care?.phlegm_suction}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "medication_medical_care.phlegm_suction",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.medication_assistance.enema")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.medication_medical_care?.enema}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("medication_medical_care.enema", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.medication_assistance.tubeFeeding")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.medication_medical_care?.tube_feeding}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "medication_medical_care.tube_feeding",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.medication_assistance.watchPatient")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.medication_medical_care?.watch}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("medication_medical_care.watch", isChecked);
            }}
          />
        </View>

        {/* Daily Assistance Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="broom"
            size={24}
            color={theme.colors.pink400}
          />
          <Text style={styles.header}>
            {t("shift.shiftReport.form.sections.dailyLiving")}
          </Text>
        </View>
        {/* Repeat for each field in DailyAssistance */}
        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.cleaning.cleaning")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.daily_assistance?.cleaning}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("daily_assistance.cleaning", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.cleaning.garbageDisposal")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.daily_assistance?.garbase_disposal}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue(
                "daily_assistance.garbase_disposal",
                isChecked
              );
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.cleaning.laundry")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.daily_assistance?.laundry}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("daily_assistance.laundry", isChecked);
            }}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.checkboxLabel}>
            {t("shift.shiftReport.form.cleaning.cooking")}
          </Text>
          <BouncyCheckbox
            fillColor={theme.colors.pink400}
            isChecked={formik.values.daily_assistance?.cooking}
            onPress={(isChecked: boolean) => {
              formik.setFieldValue("daily_assistance.cooking", isChecked);
            }}
          />
        </View>

        {/* Outgoing Transportation Section */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="bus"
            size={24}
            color={theme.colors.pink400}
          />
          <Text style={styles.header}>
            {t("shift.shiftReport.form.sections.outgoingTransportation")}
          </Text>
        </View>

        {/* Transport type */}
        {/* <ReportRadioGroup
        name="transport_type" // replace with the name of your field
        options={transport_types}
        formik={formik}
        headerLabel={t("shift.shiftReport.form.transport_type.label")}
      /> */}

        {/* Detination  */}

        {/* <View style={styles.dividerContainer}>
        <Text style={[styles.label, { paddingLeft: 10 }]}>Destination</Text>
        <TextInput
          style={styles.dividerInput}
          onChangeText={formik.handleChange("destination")}
          onBlur={formik.handleBlur("destination")}
          value={formik.values.outgoing_transportation?.destination}
        />
      </View> */}

        {/* <ReportRadioGroup
        name="support_hours" // replace with the name of your field
        options={support_hours}
        formik={formik}
        headerLabel={t("shift.shiftReport.form.support_hours.label")}
      /> */}

        {/* Outgoing transportation assistance record  */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddOutgoingAssistanceRecord}
        >
          <Text style={styles.buttonText}>
            {t("shift.shiftReport.form.outgoing_assistance.actions.addRecord")}
          </Text>
        </TouchableOpacity>

        <View style={styles.outgoingAssistanceContainer}>
          {formik.values.outgoing_assistance &&
            formik.values.outgoing_assistance.map(
              (record: OutgoingAssistanceRecord, index: number) => (
                <View key={index}>
                  {/* Outgoing Assistance Fields */}
                  {/* <Text>T</Text> */}
                  <View style={styles.dividerContainer}>
                    <TextInput
                      style={styles.dividerInput}
                      onChangeText={formik.handleChange(
                        `outgoing_assistance[${index}].destination`
                      )}
                      onBlur={formik.handleBlur(
                        `outgoing_assistance[${index}].destination`
                      )}
                      value={record.destination}
                      placeholder={t(
                        "shift.shiftReport.form.outgoing_assistance.destination.label"
                      )}
                    />
                  </View>

                  <View style={[styles.dividerContainer]}>
                    <DropdownSelect
                      placeholderColor="#000"
                      label={t("shift.shiftReport.form.transport_type.label")}
                      // style={[styles.dividerContainer, { marginVertical: 20 }]}
                      style={styles.dividerInput}
                      name={`outgoing_assistance[${index}].transport_type`}
                      value={record.transport_type}
                      items={transport_types.map((type) => ({
                        value: type.value,
                        label: t(type.label), // Apply translation here
                      }))}
                      onValueChange={(value, name) => {
                        formik.setFieldValue(name, value);
                      }}
                      // placeholder="Select a sport"
                      // Add other props as needed
                    />
                  </View>

                  <View style={[styles.dividerContainer]}>
                    <DropdownSelect
                      placeholderColor="#000"
                      // style={[styles.dividerContainer, { marginVertical: 20 }]}
                      style={styles.dividerInput}
                      name={`outgoing_assistance[${index}].support_hours`}
                      label={t("shift.shiftReport.form.support_hours.label")}
                      value={record.support_hours}
                      items={support_hours.map((type) => ({
                        value: type.value,
                        label: t(type.label), // Apply translation here
                      }))}
                      onValueChange={(value, name) => {
                        formik.setFieldValue(name, value);
                      }}
                      // placeholder="Select a sport"
                      // Add other props as needed
                    />
                  </View>

                  <Button
                    title={t("common.remove")}
                    onPress={() => handleRemoveOutgoingAssistanceRecord(index)}
                  />
                </View>
              )
            )}
        </View>

        <TouchableOpacity
          style={
            !formik.dirty && !formik.isSubmitting
              ? styles.disabledButton
              : styles.submitButton
          }
          onPress={() => formik.handleSubmit()}
          disabled={!formik.dirty && !formik.isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {t("shift.shiftReport.form.actions.submitReport")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    {/* </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  );
};

export default ShiftReportForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingVertical: 20,
    // paddingBottom: 30,
    paddingHorizontal: 10,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    paddingVertical: 10,
    marginLeft: 15,
    // Add other header styling as needed
  },
  checkboxLabel: {
    fontSize: 18,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 4,
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  dividerContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  dividerInput: {
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  submitButton: {
    backgroundColor: theme.colors.pink400, // This should match the knob color
    borderRadius: 16,
    padding: 12,
    width: "50%", // Set width to 50% of the screen
    alignSelf: "center", // Center the button
    marginTop: 20, // Margin top for spacing
  },
  submitButtonText: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#CCCCCC", // A grey color for the disabled state
    borderRadius: 16,
    padding: 12,
    width: "50%",
    alignSelf: "center",
    marginTop: 20,
  },
  // outgoing assistance record
  outgoingAssistanceContainer: {
    // paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between", // Adjusts children to be spaced out vertically
    marginBottom: 10, // Adds bottom margin for spacing between fields
  },
  addButton: {
    color: "#007bff", // Example color
    padding: 10,
    // borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: "#dc3545", // Example color
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    // color: "#fff",
    color: "#007bff", // Example color
    fontSize: 18,
  },
});
