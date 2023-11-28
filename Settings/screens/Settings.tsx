import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {useNavigation } from '@react-navigation/native';
import { AppNavigationProp } from '../../AppScreens';
import { useTranslation } from 'react-i18next';

type SettingsOptionProps = {
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

const SettingsOption: React.FC<SettingsOptionProps> = ({ title, iconName, onPress }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Ionicons name={iconName} size={24} color="grey" />
    <Text style={styles.optionText}>{title}</Text>
    <Ionicons name="chevron-forward-outline" size={24} color="grey" />
  </TouchableOpacity>
);

type SettingsScreenProps = {
  onLogout: () => void;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  const {t} = useTranslation()
  const navigation = useNavigation<AppNavigationProp>();

  // Handlers for each option can be added here
  const handlePressOption = (option: string) => {
    navigation.navigate(option);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <SettingsOption title={t("settings.links.account")} iconName="person-outline" onPress={() => handlePressOption('Account')} />
        <SettingsOption title={t("settings.links.general")}  iconName="settings-outline" onPress={() => handlePressOption('GeneralSettings')} />
        <SettingsOption title={t("settings.links.help")} iconName="help-circle-outline" onPress={() => handlePressOption('Help')} />
        <SettingsOption title={t("settings.links.notifications")}  iconName="notifications-outline" onPress={() => handlePressOption('Notifications')} />
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    marginTop: 35,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: 'grey',
  },
  logoutButton: {
    backgroundColor: '#f43f5e',
    marginVertical: 20,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SettingsScreen;