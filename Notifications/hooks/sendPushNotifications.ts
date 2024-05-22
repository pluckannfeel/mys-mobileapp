// import { useQuery } from "react-query";
// import { Notification } from "../types/Notification";
// import { axiosInstance } from "../../api/server";

// // interface PushNotificationsProps {
// //   token: string;
// //   title: string;
// //   body: string;
// // }

// const sendPushNotifications = async (
//   token: string,
//   title: string,
//   body: string
// ): Promise<any> => {
//   const { data } = await axiosInstance.post(
//     `/notifications/send_push_notification`,
//     {
//       token: token,
//       title: title,
//       body: body,
//     }
//   );

//   return data;
// };

// export function use(token: string, title: string, body: string) {
//   return useQuery(
//     "push-notifications",
//     () => sendPushNotifications(token, title, body),
//     {
//       enabled: !!token,
//       //   suspense: false,
//     }
//   );
// }
export {};
