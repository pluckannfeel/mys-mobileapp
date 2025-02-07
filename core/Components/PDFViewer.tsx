import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  ScaledSize,
  View,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme/theme";
import Loader from "../../core/Components/Loader";
import Pdf from "react-native-pdf";
import * as ScreenOrientation from "expo-screen-orientation";

// Assuming these types are defined and imported from elsewhere
import { AppNavigationProp } from "../../AppScreens";

const PDFViewerScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: { url: string } }, "params">>();
  const { url } = route.params;
  const navigation = useNavigation<AppNavigationProp>();

  const { t } = useTranslation();
  // const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            const orientation = await ScreenOrientation.getOrientationAsync();
            if (
              orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
              orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT
            ) {
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
              );
            } else {
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
              );
            }
            setDimensions(Dimensions.get("window")); // Update dimensions after orientation change
          }}
          style={{ marginRight: 10 }}
        >
          <MaterialCommunityIcons
            name="rotate-right"
            size={30}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const handleChange = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };

    const subscription = Dimensions.addEventListener("change", handleChange);

    return () => {
      // Unlock the orientation and reset to portrait when the component is unmounted
      ScreenOrientation.unlockAsync().then(() => {
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      });
      subscription?.remove();
    };
  }, []);

  const handlePdfError = (error: any) => {
    console.log(error);
    Alert.alert("Error", "Failed to load PDF");
    navigation.dispatch(StackActions.pop());
  };

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: url }}
        onError={handlePdfError}
        style={[styles.pdf, { width: dimensions.width, height: dimensions.height }]}
      />
    </View>
  );
};

export default PDFViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pdf: {
    flex: 1,
  },
});
