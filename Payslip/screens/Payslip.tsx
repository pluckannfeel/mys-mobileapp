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
import Empty from "../../core/Components/Empty";
import Loader from "../../core/Components/Loader";
import DropDownPicker from "react-native-dropdown-picker";

type PayslipProps = {
  userInfo: UserInfo;
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 4 }, (_, index) => currentYear - index);

const PayslipScreen: React.FC<PayslipProps> = ({ userInfo }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<AppNavigationProp>();
  const headerHeight = useHeaderHeight();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [openPicker, setOpenPicker] = useState<boolean>(false);

  const { data: initialPayslips, isLoading } = usePayslips(
    userInfo?.staff_code as string
  );

  const [payslips, setPayslips] = useState<Payslip[] | []>([]);

  useEffect(() => {
    if (initialPayslips && initialPayslips.length > 0) {
      const filteredAndSortedPayslips = initialPayslips
        .filter((payslip) => {
          const releaseYear = getYear(
            parseISO(payslip.release_date.toString())
          );
          return releaseYear === selectedYear;
        })
        .sort((a, b) => {
          // Sort by release_date in descending order (most recent first)
          return (
            parseISO(b.release_date.toString()).getTime() -
            parseISO(a.release_date.toString()).getTime()
          );
        });

      setPayslips(filteredAndSortedPayslips);
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
        console.error("Error refreshing payslips", error);
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

  {
    /*  <View style={styles.inputContainer}>
        {/* <Text style={styles.label}>{t("payslip.filter.filterByYear")}</Text>
         <FilterSelect
          placeholderColor="#000"
          label={t("payslip.filter.filterByYear")}
          style={styles.input}
          name="filterYear"
          value={selectedYear}
          items={years.map((year) => ({
            value: year, // 'year' should be a number here
            key: year.toString(), // Convert number to string for the label
          }))}
          onValueChange={(value) => {
            // console.log(value);
            setSelectedYear(value); // Update the state
          }} 
        />
        <SelectList
          setSelected={(value: string) => setSelectedYear(parseInt(value))}
          data={years.map((year) => ({
            key: year.toString(),
            value: year.toString(),
          }))}
          // defaultOption={{
          //   key: currentYear.toString(),
          //   value: currentYear.toString(),
          // }}
          search={false}
        /> 
      </View>*/
  }

  // Define the header component with the filter
  const renderHeader = () => {
    return (
      <DropDownPicker
        open={openPicker}
        value={selectedYear} // Ensure this is a number
        items={years.map((year) => ({
          label: year.toString(), // Display label as a string
          value: year, // Use the year as the value (this will be a number)
        }))}
        setOpen={setOpenPicker}
        setValue={(value) => setSelectedYear(value)} // Set the selected year (which is a number)
        containerStyle={{
          // width: "80%",
          // zIndex: 9999, // Ensures that the dropdown is on top of other elements
          // position: "relative", // Ensures proper stacking of elements
          // elevation: 10,
        }}
        placeholder="Select a year" // Optional placeholder
      />
    );
  };

  return isLoading ? (
    <Loader />
  ) : (
    <SafeAreaView style={[styles.container, { marginTop: headerHeight + 10 }]}>
      <StatusBar style="dark" />
      <DropDownPicker
        open={openPicker}
        value={selectedYear} // Ensure this is a number
        items={years.map((year) => ({
          label: year.toString(), // Display label as a string
          value: year, // Use the year as the value (this will be a number)
        }))}
        setOpen={setOpenPicker}
        setValue={(value) => setSelectedYear(value)} // Set the selected year (which is a number)
        // disabledStyle={{
        //   opacity: 0.5
        // }}
        // searchable={true}
        containerStyle={{
          width: "30%",
          alignSelf: "flex-end",
          paddingRight: 10,
          zIndex: 9999, // Ensures that the dropdown is on top of other elements
          // position: "relative", // Ensures proper stacking of elements
          elevation: 10,
        }}
        style={{
          padding: 0,
          margin: 0,
        }}
        placeholder="Select a year" // Optional placeholder
      />
      <FlatList
        data={payslips}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        keyExtractor={(item: Payslip) => item.id.toString()}
        renderItem={({ item }) => <PayslipItem {...item} />}
        ListEmptyComponent={<Empty label={t("common.empty")} />}
        // ListHeaderComponent={renderHeader} // Add the header component here
      />
    </SafeAreaView>
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
    justifyContent: "flex-start", // Align to the right side
    alignItems: "center",
    // paddingRight: 20, // Add padding to the right side
    width: "100%",
  },
  input: {
    minWidth: 150, // Minimum width to show the value, adjust as needed
    flexDirection: "row", // Align value horizontally
    textAlignVertical: "center", // Vertically center value
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 20,
    // backgroundColor: "rgba(0,0,0,0.05)",
    // borderRadius: 15,
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
