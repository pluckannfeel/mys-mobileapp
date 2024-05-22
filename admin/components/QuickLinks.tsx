import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ListRenderItemInfo,
  ImageSourcePropType,
} from "react-native";
import {
  NavigationContainer,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import { AppNavigationProp, PrivateStackParamList } from "../../AppScreens";
import { useTranslation } from "react-i18next";

import iconProfile from "../../assets/images/links/user.png";
import iconPayslip from "../../assets/images/links/yen.png";
import iconLeaveRequests from "../../assets/images/links/rest.png";
import iconTax from "../../assets/images/links/accounting.png";
import iconLicenses from "../../assets/images/links/agreement.png";
import iconEmergency from "../../assets/images/links/phone-call.png";
import iconSettings from "../../assets/images/links/gear.png";

type ListItem = {
  id: string;
  icon: ImageSourcePropType;
  title: string;
  link: keyof PrivateStackParamList; // Ensure the link type aligns with your navigation routes
};

const data: ListItem[] = [
  //   {
  //     id: "1",
  //     icon: "https://example.com/icon1.png",
  //     title: "Home",
  //     link: "Home",
  //   },
  {
    id: "2",
    icon: iconProfile,
    title: "admin.drawer.menu.profile",
    link: "Profile",
  },
  {
    id: "3",
    icon: iconPayslip,
    title: "admin.drawer.menu.payslip",
    link: "Payslip",
  },
  {
    id: "4",
    icon: iconLeaveRequests,
    title: "admin.drawer.menu.leaveRequests",
    link: "LeaveRequests",
  },
  {
    id: "5",
    icon: iconTax,
    title: "admin.drawer.menu.taxcertificate",
    link: "Taxcertificate",
  },
  {
    id: "6",
    icon: iconLicenses,
    title: "admin.drawer.menu.licenses",
    link: "License",
  },
  {
    id: "7",
    icon: iconEmergency,
    title: "admin.drawer.menu.emergencyContact",
    link: "EmergencyContact",
  },
  {
    id: "8",
    icon: iconSettings,
    title: "admin.drawer.menu.settings",
    link: "Settings",
  },
  // Add more items as needed
];

const QuickLinks: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { t } = useTranslation();

  const renderItem = ({ item }: ListRenderItemInfo<ListItem>) => (
    <TouchableOpacity onPress={() => navigation.navigate(item.link)}>
      <View style={styles.item}>
        <Image source={item.icon} style={styles.icon} />
        <Text style={styles.text}>{t(item.title)}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <View>
      <Text style={styles.header}>{t("admin.drawer.menu.quickLinks")}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default QuickLinks;

const styles = StyleSheet.create({
  list: {
    alignItems: "center",
    padding: 10,
  },
  item: {
    marginHorizontal: 10,
    alignItems: "center", // Center items vertically in column
  },
  icon: {
    width: 50,
    height: 50,
    // borderRadius: 25, // Half of the width and height to make it fully round
    marginBottom: 16, // Space between the icon and the text
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    paddingVertical: 20, // Adds space above and below the header
    paddingLeft: 16, // Align text to start with the content of the list
  },
});
