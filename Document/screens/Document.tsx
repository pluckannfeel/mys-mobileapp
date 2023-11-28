import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation, StackActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { AppNavigationProp } from "../../AppScreens";

type Props = {};

const DocumentScreen = (props: Props) => {
  const { t } = useTranslation();

  const navigation = useNavigation<AppNavigationProp>();
  useLayoutEffect(() => {
    // Set the navigation header title
    navigation.setOptions({
      title: t("admin.drawer.menu.document"),
      // headerTitleAlign: 'center',
      // headerTransparent: true,
    });
  }, [navigation]);

  return (
    <View>
      <Text>Document</Text>
    </View>
  );
};

export default DocumentScreen;

const styles = StyleSheet.create({});
