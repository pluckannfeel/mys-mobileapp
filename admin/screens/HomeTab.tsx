// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { TouchableOpacity } from "react-native";
// import { NavigationContainer } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import ShiftScreen from "../../Shift/screens/Shift";
// import PayslipScreen from "../../Payslip/screens/Payslip";
// import ProfileScreen from "../../Profile/Screens/Profile";
// import DocumentScreen from "../../Document/screens/Document";
// import { UserInfo } from "../../auth/types/userInfo";

// const Tab = createBottomTabNavigator();

// type Props = {};

// const HomeScreen = (props: Props) => {



//   return (
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ focused, color, size }) => {
//             let iconName: React.ComponentProps<typeof Ionicons>["name"];

//             if (route.name === "Shift") {
//               iconName = focused ? "time" : "time-outline";
//             } else if (route.name === "Payslip") {
//               iconName = focused ? "wallet" : "wallet-outline";
//             } else if (route.name === "Profile") {
//               iconName = focused ? "person-circle-sharp" : "person-circle-outline";
//             } else if (route.name === "Document") {
//               iconName = focused ? "document-text" : "document-text-outline";
//             } else {
//               iconName = "ellipse"; // Default icon
//             }

//             // You can return any component that you like here!
//             return <Ionicons name={iconName} size={size} color={color} />;
//           },
//         })}
//       >
//         <Tab.Screen name="Shift" component={ShiftScreen}  />
//         <Tab.Screen name="Payslip" component={PayslipScreen} />
//         <Tab.Screen name="Document" component={DocumentScreen} />
//         <Tab.Screen name="Profile" component={ProfileScreenWrapper} />
        
//         {/* Add your other Tab.Screens here... */}
//       </Tab.Navigator>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({});

export {}