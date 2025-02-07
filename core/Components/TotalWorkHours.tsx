import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { theme } from "../theme/theme";
import { useState, useEffect } from "react";

type TotalWorkHoursProps = {
  data: string; // actual totalworkhours
  loading: boolean;
  refetch: () => void;
};

const TotalWorkHours: React.FC<TotalWorkHoursProps> = ({
  data,
  loading,
  refetch,
}) => {
  const { t, i18n } = useTranslation(); // Access the language settings from i18n

  // State for storing the formatted current month-year
  const [currentMonthYear, setCurrentMonthYear] = useState<string>("");

  useEffect(() => {
    // Check language to determine how to format the date
    const locale = i18n.language; // Detect the current language

    const dateFormatter =
      locale === "ja" // If Japanese, format as "2024年11月"
        ? new Intl.DateTimeFormat("ja-JP", {
            year: "numeric",
            month: "long",
          })
        : new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
          });

    const formattedDate = dateFormatter.format(new Date());
    setCurrentMonthYear(formattedDate);
  }, [i18n.language]); // Re-run when language changes

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.pink500} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header: Current Month and Year */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{currentMonthYear}</Text>
      </View>

      {/* Service Hours Section */}
      <View style={styles.serviceHoursContainer}>
        <Text style={styles.title}>{t("home.totalServiceHours")}</Text>
        <Text style={styles.hours}>{`${data} ${t("home.hours")}`}</Text>
      </View>
    </View>
  );
};

export default TotalWorkHours;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centers the content vertically
    alignItems: "center", // Centers the content horizontally
    paddingHorizontal: 20, // Adds some horizontal padding to avoid content touching edges
  },
  headerContainer: {
    alignSelf: "flex-start", // Aligns the header text to the left
    marginBottom: 10, // Adds spacing between header and service hours
    marginTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  serviceHoursContainer: {
    alignItems: "center", // Centers the service hours text
  },
  title: {
    fontSize: 18,
    marginBottom: 5, // Adds space below the title
  },
  hours: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.pink500, // Adds color for emphasis
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center", // Centers the spinner
    alignItems: "center", // Centers the spinner horizontally
  },
});
