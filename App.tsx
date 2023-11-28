import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppScreens from "./AppScreens";
import AuthProvider from "./auth/contexts/AuthProvider";
import { ThemeProvider } from "./core/contexts/ThemeProvider";

import { QueryClient, QueryClientProvider } from "react-query";
import Loader from "./core/Components/Loader";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SettingsProvider from "./core/contexts/SettingsProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./core/config/i18n";
import SelectedShiftProvider from "./Shift/contexts/SelectedShiftProvider";
import Toast from "react-native-toast-message";
import { toastConfig } from "./core/config/toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      suspense: true,
    },
  },
});

const App = () => {
  return (
    <React.Suspense fallback={<Loader />}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <SettingsProvider>
              <SafeAreaProvider>
                <SelectedShiftProvider>
                  <AppScreens />
                  <Toast config={toastConfig} />
                </SelectedShiftProvider>
              </SafeAreaProvider>
            </SettingsProvider>
          </AuthProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </React.Suspense>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
