import { format } from "date-fns";
import { useSettings } from "../contexts/SettingsProvider";
import * as FileSystem from "expo-file-system";
import { Platform, Linking } from "react-native";

export function getDayKanji(date: Date, language: string): string {
  const day = format(date, "e"); // Get the day of the week as a number (1-7)
  let kanjiDays;

  if (language === "ja") {
    kanjiDays = ["日", "月", "火", "水", "木", "金", "土"];
  } else {
    kanjiDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  }

  return kanjiDays[parseInt(day) - 1]; // Adjust index because array is 0-indexed
}

export function convertToTimeString(date: Date): string {
  // Ensuring leading zeros for hours and minutes
  if (!date) return "";

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  // if(hours === "00" && minutes === "00") return "24:00";

  return `${hours}:${minutes}`;
}

export const convertToBase64 = async (uri: string) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error("Error converting image to Base64", error);
    return null;
  }
};

export const openSettings = () => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:");
  } else {
    Linking.openSettings(); // This method requires `expo-linking` to be installed
  }
};

export const mapWeatherCodeToIcon = (code: number) => {
  switch (code) {
    case 200: // thunderstorm with light rain
    case 201: // thunderstorm with rain
    case 202: // thunderstorm with heavy rain
    case 210: // light thunderstorm
    case 211: // thunderstorm
    case 212: // heavy thunderstorm
    case 221: // ragged thunderstorm
    case 230: // thunderstorm with light drizzle
    case 231: // thunderstorm with drizzle
    case 232: // thunderstorm with heavy drizzle
      return require("../../assets/images/thunderstorm.png"); // Replace with your asset name
    case 300: // light intensity drizzle
    case 301: // drizzle
    case 302: // heavy intensity drizzle
    case 310: // light intensity drizzle rain
    case 311: // drizzle rain
    case 312: // heavy intensity drizzle rain
    case 313: // shower rain and drizzle
    case 314: // heavy shower rain and drizzle
    case 321: // shower drizzle
      return require("../../assets/images/drizzle.png"); // Replace with your asset name
    case 500: // light rain
    case 501: // moderate rain
    case 502: // heavy intensity rain
    case 503: // very heavy rain
    case 504: // extreme rain
    case 511: // freezing rain
    case 520: // light intensity shower rain
    case 521: // shower rain
    case 522: // heavy intensity shower rain
    case 531: // ragged shower rain
      return require("../../assets/images/rain.png"); // Replace with your asset name
    case 600: // light snow
    case 601: // snow
    case 602: // heavy snow
    case 611: // sleet
    case 612: // shower sleet
    case 613: // light rain and snow
    case 615: // light rain and snow
    case 616: // rain and snow
    case 620: // light shower snow
    case 621: // shower snow
    case 622: // heavy shower snow
      return require("../../assets/images/snow.png"); // Replace with your asset name
    case 701: // mist
      return require("../../assets/images/fog.png");
    case 711: // smoke
    case 721: // haze
    case 731: // sand, dust whirls
    case 741: // fog
    case 751: // sand
    case 761: // dust
    case 762: // volcanic ash
    case 771: // squalls
    case 781: // tornado
      return require("../../assets/images/unknown.png");
    case 800: // clear sky
      return require("../../assets/images/sunny.png");
    case 801: // few clouds
    case 802: // scattered clouds
    case 803: // broken clouds
    case 804: // overcast clouds
      return require("../../assets/images/clouds.png");

    default:
      return "default_weather_icon"; // A default icon
  }
};
