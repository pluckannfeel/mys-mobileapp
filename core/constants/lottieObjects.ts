import { AnimationObject } from "lottie-react-native";

export interface LottieFiles {
  id: number;
  animation: AnimationObject | { uri: string } | string;
  text: string;
  textColor: string;
  backgroundColor: string;
}

export const data: LottieFiles[] = [
  {
    id: 1,
    animation: require("../../assets/animations/inprogress.json"),
    text: "In Progress View",
    textColor: "#005b4f",
    backgroundColor: "#ffa3ce",
  },
  {
    id: 2,
    animation: require("../../assets/animations/serverError.json"),
    text: "In Progress View",
    textColor: "#005b4f",
    backgroundColor: "#ffa3ce",
  },
];

// export const data: OnboardingData[] = [
//   {
//     id: 1,
//     animation: require("../../../assets/animations/calendar.json"),
//     text: "See Shift Schedule, Calendar, etc.",
//     textColor: "#005b4f",
//     backgroundColor: "#ffa3ce",
//   },
//   {
//     id: 2,
//     animation: require("../../../assets/animations/reporting.json"),
//     text: "Report daily activities, patient status ",
//     textColor: "#1e2169",
//     backgroundColor: "#bae4fd",
//   },
//   {
//     id: 3,
//     animation: require("../../../assets/animations/profile.json"),
//     text: "Lorem Ipsum dolor sit amet",
//     textColor: "#F15937",
//     backgroundColor: "#faeb8a",
//   },
// ];
