import React from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { format, parseISO } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import { useWeatherAPI } from "../hooks/useWeather";
import { mapWeatherCodeToIcon } from "../helpers/functions";

const WeatherWidget = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language === "en" ? enUS : ja;

  const { data: weatherData, isLoading, error } = useWeatherAPI(i18n.language);

  // Format the date to display as "Thu, Dec 7, 2023"
  const formattedDate = format(new Date(), "EEE, MMM d, yyyy", {
    locale,
  });
  return (
    <View style={styles.widgetContainer}>
      {/* {isLoading ? (
        <Text>Loading...</Text> // Or any other loading indicator
      ) : (
        <> */}
      {weatherData?.weatherIcon && (
        <Image
          source={{ uri: `https:${weatherData.weatherIcon}` }}
          style={styles.weatherIcon}
        />
      )}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text style={styles.temperatureText}>
          {weatherData?.temperature}
          <Text style={styles.celsiusSymbol}>°C</Text>
        </Text>
      </View>
      <View style={styles.dateAndTypeContainer}>
        <Text style={styles.dateText}>{formattedDate}</Text>
        <Text style={styles.weatherType}>{weatherData?.type}</Text>
      </View>
      {/* </>
      )} */}
    </View>
  );
};

export default WeatherWidget;

const styles = StyleSheet.create({
  widgetContainer: {
    marginVertical: 5,
    paddingHorizontal: 20, // Horizontal padding
    backgroundColor: "#FFFFFF", // White background for the widget
    flexDirection: "row", // Elements in a row
    // flexWrap: "wrap", // Wrap the elements if they overflow
    alignItems: "center", // Vertically center elements in the container
    justifyContent: "space-evenly", // Space between the elements
    padding: 10, // Padding inside the widget container
    borderRadius: 16, // Rounded corners
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  weatherIcon: {
    width: 70, // Sizable icon for visibility
    height: 70,
  },
  temperatureText: {
    fontSize: 50, // Adjust the font size accordingly
    fontWeight: "300",
    color: "#000",
    lineHeight: Platform.OS === "ios" ? 50 : 100,
  },
  celsiusSymbol: {
    fontSize: 22, // Smaller font size for the Celsius symbol
    fontWeight: "300",
    color: "#000",
    lineHeight: Platform.OS === "ios" ? 25 : 100,
  },
  dateAndTypeContainer: {
    // New container for the date and type
    alignItems: "flex-end", // Aligns text to the right
  },
  dateText: {
    fontSize: 18,
    // color: "#888",
    color: "#000",
    fontWeight: "bold", // Bold for the date
    marginBottom: 4, // Space between the date and the type
  },
  weatherType: {
    fontSize: 18,
    color: "#555",
    fontWeight: "normal", // Normal weight for the type
  },
});
