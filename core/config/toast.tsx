// App.jsx
import { View, Text } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { theme } from "../theme/theme";

export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#71CD47", width: "90%", borderRadius: 5 }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "400",
      }}
      text2Style={{
        fontSize: 16,
        fontWeight: "400",
      }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", width: "90%", borderRadius: 5 }}
      contentContainerStyle={{ paddingHorizontal: 10 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "400",
      }}
      text2Style={{
        fontSize: 16,
        fontWeight: "400",
      }}
    />
  ),
  /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
  tomatoToast: ({ text1, props }: any) => (
    <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
      <Text>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  ),
};
