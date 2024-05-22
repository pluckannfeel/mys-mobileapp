import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { FilterSelect } from "../components/FilterSelect";
import { useTranslation } from "react-i18next";
import { UserInfo } from "../../auth/types/userInfo";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { getYear, parseISO } from "date-fns";
import { AppNavigationProp } from "../../AppScreens";
import { usePayslips } from "../hooks/usePayslips";
import Payslip from "./Payslip";
import { TaxCertificate } from "../types/taxcertificate";
import { useTaxCertificates } from "../hooks/useTaxCertificates";
import PayslipItem from "../components/PayslipItem";
import TaxcertificateItem from "../components/TaxcertificateItem";
import { StatusBar } from "expo-status-bar";
import Empty from "../../core/Components/Empty";
import Loader from "../../core/Components/Loader";

type TaxcertificateScreenProps = { userInfo: UserInfo };

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, index) => currentYear - index);

const TaxcertificateScreen = ({ userInfo }: TaxcertificateScreenProps) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<AppNavigationProp>();
  const headerHeight = useHeaderHeight();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  const { data: initialTaxCertificates, isLoading } = useTaxCertificates(
    userInfo?.staff_code as string
  );

  const [taxcertificates, setTaxcertificates] = useState<TaxCertificate[] | []>(
    []
  );

  useEffect(() => {
    if (initialTaxCertificates && initialTaxCertificates.length > 0) {
      const filteredAndSortedPayslips = initialTaxCertificates
        .filter((taxes) => {
          const releaseYear = getYear(parseISO(taxes.release_date.toString()));
          return releaseYear === selectedYear;
        })
        .sort((a, b) => {
          // Sort by release_date in descending order (most recent first)
          return (
            parseISO(b.release_date.toString()).getTime() -
            parseISO(a.release_date.toString()).getTime()
          );
        });

      setTaxcertificates(filteredAndSortedPayslips);
    }
  }, [selectedYear, initialTaxCertificates]);

  useLayoutEffect(() => {
    // Set the navigation header title
    navigation.setOptions({
      title: t("admin.drawer.menu.taxcertificate"),
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
        console.error("Error refreshing taxcertificates", error);
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
        {/* <Text style={styles.label}>{t("payslip.filter.filterByYear")}</Text>
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
        /> */}
      </View>
    );
  };

  return isLoading ? (
    <Loader />
  ) : (
    <SafeAreaView style={[styles.container, { marginTop: headerHeight + 10 }]}>
      <StatusBar style="dark" />

      {taxcertificates.length > 0 ? (
        <FlatList
          data={taxcertificates}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item: TaxCertificate) => item.id.toString()}
          renderItem={({ item }) => <TaxcertificateItem {...item} />}
          ListHeaderComponent={renderHeader} // Add the header component here
        />
      ) : (
        <Empty label={t("common.empty")} />
      )}
    </SafeAreaView>
  );
};

export default TaxcertificateScreen;

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
