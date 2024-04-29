import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { AppNavigationProp } from "../../AppScreens";
import { useNavigation, StackActions } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import { usePayslips } from "../hooks/usePayslips";
import { useAuth } from "../../auth/contexts/AuthProvider";
import { UserInfo } from "../../auth/types/userInfo";
import { DropdownSelect } from "../../core/Components/DropdownSelect";
import { FilterSelect } from "../components/FilterSelect";
import { MaterialIcons } from "@expo/vector-icons";
import { Payslip } from "../types/payslip";
import PayslipItem from "../components/PayslipItem";
import { getYear, parseISO } from "date-fns";

type PayslipProps = {
  userInfo: UserInfo;
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, index) => currentYear - index);

const PayslipScreen: React.FC<PayslipProps> = ({ userInfo }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<AppNavigationProp>();
  const headerHeight = useHeaderHeight();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const { data: initialPayslips, isLoading } = usePayslips(
    userInfo?.staff_code as string
  );

  const [payslips, setPayslips] = useState<Payslip[] | []>([]);

  useEffect(() => {
    if (initialPayslips && initialPayslips.length > 0) {
      const filteredPayslips = initialPayslips.filter((payslip) => {
        const releaseYear = getYear(parseISO(payslip.release_date.toString()));
        return releaseYear === selectedYear;
      });
      setPayslips(filteredPayslips);
    }
  }, [selectedYear, initialPayslips]);

  useLayoutEffect(() => {
    // Set the navigation header title
    navigation.setOptions({
      title: t("admin.drawer.menu.payslip"),
      // headerTitleAlign: 'center',
      headerTransparent: true,
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
      },
    });
  }, [navigation]);

  const onRefresh = useCallback(
    async () => {
      setRefreshing(true);
      try {
        // Add your data fetching logic here.
        // await refetchLeaveRequests();
      } catch (error) {
        console.error("Error refreshing notifications", error);
      } finally {
        // Wait for 3 seconds before setting refreshing to false
        setTimeout(() => {
          setRefreshing(false);
        }, 2000);
      }
    },
    [
      // refetchLeaveRequests
    ]
  );

  // Define the header component with the filter
  const renderHeader = () => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t("payslip.filter.filterByYear")}</Text>
        <FilterSelect
          placeholderColor="#000"
          label={t("payslip.filter.filterByYear")}
          style={styles.input}
          name="filterYear"
          value={selectedYear}
          items={years.map((year) => ({
            value: year, // 'year' should be a number here
            label: year.toString(), // Convert number to string for the label
          }))}
          onValueChange={(value) => {
            // console.log(value);
            setSelectedYear(value); // Update the state
          }}
        />
      </View>
    );
  };

  return (
    <React.Fragment>
      <SafeAreaView
        style={[styles.container, { marginTop: headerHeight + 10 }]}
      >
        <StatusBar style="dark" />

        <FlatList
          data={payslips}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item: Payslip) => item.id.toString()}
          renderItem={({ item }) => <PayslipItem {...item} />}
          ListHeaderComponent={renderHeader} // Add the header component here
        />
      </SafeAreaView>
    </React.Fragment>
  );
};

export default PayslipScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Add your styling here
  },
  card: {
    margin: 10,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
    // Add shadows and other styling
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    // Style for details section
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", // Align to the right side
    alignItems: "center",
    paddingRight: 20, // Add padding to the right side
    width: "100%",
  },
  input: {
    minWidth: 100, // Minimum width to show the value, adjust as needed
    flexDirection: "row", // Align value horizontally
    textAlignVertical: "center", // Vertically center value
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 15,
    color: "black",
    textAlign: "center",
    // marginRight: 10, // Add space between label and dropdown
  },
  label: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
    paddingRight: 10, // Space between label and dropdown
  },
});
