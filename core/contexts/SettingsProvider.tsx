import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSecureStorage } from "../hooks/useSecureStorage";
import { useTranslation } from "react-i18next";

export type ModeThemeProp = "dark" | "light" | "auto";

// Define the Context and Interface
interface SettingsContextInterface {
  language: string;
  mode: ModeThemeProp;
  changeLanguage: (language: string) => void;
  changeMode: (mode: ModeThemeProp) => void;
  // notification: boolean;
  // changeNotifications: (notification: boolean) => void;
}

export const SettingsContext = createContext({} as SettingsContextInterface);

// Create the Provider Component
type SettingsProviderProps = {
  children: React.ReactNode;
};

const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { i18n, t } = useTranslation();

  const [language, setLanguage] = useSecureStorage<string>("language", "ja");

  const [mode, setMode] = useSecureStorage<ModeThemeProp>("mode", "light");

  // const [notification, setNotification] = useSecureStorage<boolean>(
  //   "notification",
  //   true
  // );

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [
    
  ]); // Add language as a dependency

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Update i18n language
  };

  // const changeNotifications = (notification: boolean) => {
  //   setNotification(notification);
  // };

  const changeMode = (newMode: ModeThemeProp) => setMode(newMode);

  const value = useMemo(
    () => ({
      language,
      mode,
      changeLanguage,
      changeMode,
      // notification,
      // changeNotifications,
    }),
    [language, mode]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom Hook to use Settings Context
export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsProvider;
