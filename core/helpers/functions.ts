import { format } from "date-fns";
import { useSettings } from "../contexts/SettingsProvider";

export function getDayKanji(date: Date, language: string): string {

  const day = format(date, "e"); // Get the day of the week as a number (1-7)
  let kanjiDays; 
  
  if (language === "ja"){
    kanjiDays = ["日", "月", "火", "水", "木", "金", "土"];
  }else {
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