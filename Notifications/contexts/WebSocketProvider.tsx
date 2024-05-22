import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { baseUrl } from "../../api/server";
import { useQueryClient } from "react-query";
import { useAuth } from "../../auth/contexts/AuthProvider";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";
import { useSecureStorage } from "../../core/hooks/useSecureStorage";

// Define the type for the context value
interface WebSocketContextType {
  notifications: Notification[];
  deviceToken?: string;
}

// Provide a default value matching the type
const defaultContextValue: WebSocketContextType = {
  notifications: [],
  deviceToken: "",
};

const WebSocketContext =
  createContext<WebSocketContextType>(defaultContextValue);

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { userInfo } = useAuth();

  // const [deviceToken, setDeviceToken] = useState<string>();
  const [deviceToken, setDeviceToken] = useSecureStorage<string>(
    "deviceToken",
    ""
  );

  // // const { userInfo } = useAuth();
  // let token;
  // if(!authKey){
  //   token = "anoynmous"
  // }else{
  //   token = authKey
  // }

  // let wsUrl: string;

  // wsUrl = `ws://${baseUrl.replace(
  //   /^http(s)?:\/\//,
  //   ""
  // )}wss/notifications?client=mobile&token=anoynmous`;
  // console.log(wsUrl);

  useEffect(() => {
    // const ws = new WebSocket(wsUrl);

    // PUSH NOTIFICATIONS
    const registerForPushNotificationsAsync = async () => {
      let token;

      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          // alert("Failed to get push token for push notification!");
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
      } else {
        // alert("Must use physical device for Push Notifications");
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      // console.log(token)

      // alert("device token: " + token);
      // setDeviceToken(token as string);
      
      console.log(userInfo)

      return token;
    };

    // Call this function in your app entry point or at an appropriate time
    registerForPushNotificationsAsync();

    // console.log("device token: ", token);

    // This listener is fired whenever a notification is received while the app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "Look at that notification",
    //     body: "I'm so proud of myself!",
    //   },
    //   trigger: null,
    // });

    // ws.onopen = () => {
    //   console.log("WebSocket Connected");
    // };

    // ws.onmessage = (event) => {
    //   const newNotification: Notification = JSON.parse(event.data);
    //   // console.log("new notification: ", newNotification);
    //   setNotifications((prevNotifications) => [
    //     ...prevNotifications,
    //     newNotification,
    //   ]);

    //   queryClient.invalidateQueries("notifications");

    //   // call  send push notifications to expo notifications

    //   queryClient.invalidateQueries("leave_requests");
    // };

    // ws.onclose = () => {
    //   // console.log("WebSocket Disconnected");
    //   // Optionally, handle reconnection logic
    // };

    // Handle any errors
    // ws.onerror = (error) => {
    //   console.error("WebSocket Error:", error);
    // };

    return () => {
      // ws.close();

      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [setDeviceToken]);

  return (
    <WebSocketContext.Provider value={{ notifications, deviceToken }}>
      {children}
    </WebSocketContext.Provider>
  );
};
