import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation, StackActions } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { t } from "i18next";
import { theme } from "../../core/theme/theme";
import { AppNavigationProp } from "../../AppScreens";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../core/contexts/ThemeProvider";

type Props = {};

const NotificationsScreen = (props: Props) => {
  // get HeaderHeight
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation<AppNavigationProp>();
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  useLayoutEffect(() => {
    // if (!isLoading) {
    navigation.setOptions({
      // title: t("admin.drawer.menu.shift"),
      // headerTitle: ShiftHeaderTitle,
      headerTransparent: true,
      // headerTintColor: "#fff",
      // headerTitleAlign: "left",

      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
      },

      //   headerRight: () => (
      //     <View style={{ flexDirection: "row", paddingRight: 5 }}>
      //       <MaterialCommunityIcons
      //         name={
      //           // shiftViewType === "default"
      //           //   ? "calendar-month-outline"
      //           //   : "view-week"
      //           "dots-vertical"
      //         }
      //         size={25}
      //         color={theme.colors.primary}
      //         style={{ marginRight: 10 }}
      //         onPress={menuHandler}
      //       />
      //     </View>
      //   ),
    });
    // }
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { marginTop: headerHeight + 10 }]}>
      <Text>NotificationsScreen</Text>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    // Your container styles
    // paddingTop: headerHeight,
    padding: 10,
  },
});
