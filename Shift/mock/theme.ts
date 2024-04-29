import { Platform } from "react-native";
import { useTheme as useCoreTheme } from "../../core/contexts/ThemeProvider";

export const themeColor = "#00AAAF";
export const lightThemeColor = "#f2f7f7";

export function getTheme() {
  const disabledColor = "grey";

  const coreTheme = useCoreTheme();

  return {
    // calendarBackground: "transparent",
    
    // arrows
    arrowColor: "#FFF",
    // arrowStyle: { padding: 5 },
    // add padding to arrows to make them easier to press
    arrowStyle: { padding: 15 },
    // arrowContainerStyle: { padding: 10 },
    // knob
    expandableKnobColor: themeColor,
    // month
    // monthTextColor: coreTheme.colors.pink500,
    monthTextColor: "#FFF",
    textMonthFontSize: 20,
    textMonthFontFamily: "HelveticaNeue",
    textMonthFontWeight: "bold" as const,
    // day names
    textSectionTitleColor: "#FFF",
    textDayHeaderFontSize: 14,
    // textDayHeaderFontFamily: 'HelveticaNeue',
    textDayHeaderFontWeight: "bold" as const,

    // dates
    // dayTextColor: "themeColor",
    dayTextColor: coreTheme.colors.pink500,
    
    // todayTextColor: "#FFF",
    // todayBackgroundColor: coreTheme.colors.pink500,
    textDayFontSize: 18,
    // selectedDayTextColor
    // textDayFontFamily: 'HelveticaNeue',
    textDayFontWeight: "500" as const,
    textDayStyle: { marginTop: Platform.OS === "android" ? 2 : 4 },

    // selected date
    // selectedDayBackgroundColor: themeColor,
    selectedDayBackgroundColor: coreTheme.colors.pink400,
    selectedDayTextColor: "white",
    // disabled date
    textDisabledColor: disabledColor,

    // dot (marked date)
    // dotColor: themeColor,
    dotColor: coreTheme.colors.pink400,
    selectedDotColor: "white",
    disabledDotColor: disabledColor,
    dotStyle: { marginTop: 0.8},
  };
}
