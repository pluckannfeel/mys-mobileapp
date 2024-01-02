import React, {
  Component,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

import { StyleSheet, Text } from "react-native";
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
import { WebSocketProvider } from "./Notifications/contexts/WebSocketProvider";
import { NetworkProvider } from "./core/contexts/NetworkProvider";
import InProgressView from "./core/Components/InProgress";
import { data as lottieFiles } from "./core/constants/lottieObjects";
import ServerError from "./core/Components/ServerError";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      suspense: true,
    },
  },
});

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render any custom fallback UI
      return (
        <ServerError
        // source={lottieFiles[1].animation}
        />
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <NetworkProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <React.Suspense fallback={<Loader />}>
              <SettingsProvider>
                <AuthProvider>
                  <WebSocketProvider>
                    <SafeAreaProvider>
                      <GestureHandlerRootView style={{ flex: 1 }}>
                        <BottomSheetModalProvider>
                          <SelectedShiftProvider>
                            <AppScreens />
                          </SelectedShiftProvider>
                        </BottomSheetModalProvider>
                      </GestureHandlerRootView>
                    </SafeAreaProvider>
                  </WebSocketProvider>
                </AuthProvider>
              </SettingsProvider>
            </React.Suspense>
          </I18nextProvider>
        </QueryClientProvider>
      </ErrorBoundary>
      <Toast config={toastConfig} />
    </NetworkProvider>
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
