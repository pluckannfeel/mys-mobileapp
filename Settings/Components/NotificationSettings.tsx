import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from "react-native";
import { theme } from "../../core/theme/theme";
import {
  ModeThemeProp,
  useSettings,
} from "../../core/contexts/SettingsProvider";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../AppScreens";
import { useTranslation } from "react-i18next";

// Define the types for your settings options
type SettingOption = {
  id: number;
  title: string;
  options: { value: string; label: string }[];
};

type RadioButtonProps = {
  isSelected: boolean;
  onPress: () => void;
};

const NotificationSettingsScreen: React.FC = () => {
  const { language, mode, changeLanguage, changeMode } = useSettings();
  const { t } = useTranslation();
  const navigation = useNavigation<AppNavigationProp>();

  useLayoutEffect(() => {
    // Set the navigation header title
    navigation.setOptions({
      //   title: "Home",
      headerTitle: "",

      //   headerTitleAlign: "center",
      headerTransparent: true,
    });
  });

  //   console.log(language, mode);

  //   const [language, setLanguage] = useState<string>(initialLanguage);
  //   const [darkMode, setDarkMode] = useState<string>("Auto");

  const settings: SettingOption[] = [
    {
      id: 1,
      title: t("settings.notificationSettings.headers.notifications"),
      options: [
        {
          value: "on",
          label: t("settings.notificationSettings.options.general.on"),
        },
        {
          value: "off",
          label: t("settings.notificationSettings.options.general.off"),
        },
      ],
    },
    // {
    //   id: 2,
    //   title: t("settings.generalSettings.headers.mode"),
    //   options: [
    //     {
    //       value: "light",
    //       label: t("settings.generalSettings.options.mode.light"),
    //     },
    //     {
    //       value: "dark",
    //       label: t("settings.generalSettings.options.mode.dark"),
    //     },
    //     {
    //       value: "auto",
    //       label: t("settings.generalSettings.options.mode.auto"),
    //     },
    //   ],
    // },
  ];

  const handleOptionChange = (settingId: number, option: string) => {
    if (settingId === 1) {
      changeLanguage(option);
    } else if (settingId === 2) {
      changeMode(option as ModeThemeProp);
    }
  };

  const RadioButton: React.FC<RadioButtonProps> = ({ isSelected, onPress }) => (
    <TouchableOpacity style={styles.circle} onPress={onPress}>
      {isSelected && <View style={styles.checkedCircle} />}
    </TouchableOpacity>
  );

  return (
    // <View style={styles.container}>
    //   {settings.map((setting) => (
    //     <View key={setting.id}>
    //       <Text style={styles.settingTitle}>{setting.title}</Text>
    //       {setting.options.map((option) => (
    //         <TouchableOpacity
    //           key={option.value}
    //           style={styles.optionRow}
    //           onPress={() => handleOptionChange(setting.id, option.value)}
    //           activeOpacity={0.6}
    //         >
    //           <Text style={styles.optionLabel}>{option.label}</Text>
    //           <RadioButton
    //             isSelected={
    //               setting.id === 1
    //                 ? language === option.value
    //                 : mode === option.value
    //             }
    //             onPress={() => handleOptionChange(setting.id, option.value)}
    //           />
    //         </TouchableOpacity>
    //       ))}
    //     </View>
    //   ))}
    // </View>
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.optionLabel}>
          {t("settings.notificationSettings.headers.notifications")}
        </Text>
        <Text style={styles.instructionsText}>
          {t("settings.notificationSettings.options.guideMessage")}
        </Text>
        <TouchableOpacity
          style={styles.openSettingsButton}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.openSettingsButtonText}>
            {t("settings.notificationSettings.options.openSettings")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 10,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 16,
    color: "#000",
    marginTop: 10,
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
  optionLabel: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },
  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.pink400,
    alignItems: "center",
    justifyContent: "center",
  },
  checkedCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.pink400,
  },
  openSettingsButton: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    backgroundColor: theme.colors.primary, // Use your theme color here
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  openSettingsButtonText: {
    fontSize: 16,
    color: "#fff", // Assuming white text on a colored button background
    fontWeight: "bold",
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  instructionsText: {
    fontSize: 16,
    marginTop: 8,
    paddingHorizontal: 16,
    lineHeight: 24, // Adjust line height for better readability
  },
});

export default NotificationSettingsScreen;
