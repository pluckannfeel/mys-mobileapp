import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { AppNavigationProp } from "../../AppScreens";
import { useNavigation, StackActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

type Props = {};

const PayslipScreen = (props: Props) => {
  const { t } = useTranslation();

  const navigation = useNavigation<AppNavigationProp>();
  useLayoutEffect(() => {
    // Set the navigation header title
    navigation.setOptions({
      title: t("admin.drawer.menu.payslip"),
      // headerTitleAlign: 'center',
      // headerTransparent: true,
    });
  }, [navigation]);

  return (
    <View>
      <Text>PayslipScreen</Text>
    </View>
  );
};

export default PayslipScreen;

const styles = StyleSheet.create({});
