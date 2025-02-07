import axios, { AxiosError, AxiosInstance } from "axios";
import Toast from "react-native-toast-message";

// baseurl for every request change this when you go into deployment
export const baseUrl =
  "https://fkuy7wira5n3shbvxt3xy3wfqm0jhvzq.lambda-url.ap-northeast-1.on.aws/";
// export const baseUrl = "https://miraicares.ap-northeast-1.elasticbeanstalk.com/";
// export const baseUrl = "https://api.mirai-cares.com";
// export const baseUrl = "http://192.168.179.7:8000/";
// export const baseUrl = "https://127.0.0.1:8000/";
// export const baseUrl = "http://192.168.3.17:8000/";
// export const baseUrl = "http://192.168.1.8:8000/";
// export const baseUrl = "http://localhost:8000/";
// export const baseUrl = "http://192.168.179.63:8000/";
// export const baseUrl = "http://192.168.0.13:8000/";
// export const baseUrl = "http://192.168.0.148:8000/";

export const googleMapApiKey = process.env.REACT_APP_GOOGLEMAP_APIKEY;
export const mysOrgCode = process.env.REACT_APP_MYSORG_CODE;

// console.log(googleMapApiKey)

const instance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  // ... other settings
});
4;
// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Handle successful response
    return response;
  },
  (error: AxiosError) => {
    // Check for network error (no response)
    if (!error.response) {
      // Handle network error
      Toast.show({
        type: "error",
        text1: "Network Error",
        text2: "Please check your internet connection.",
      });
    } else {
      // Handle other types of errors (e.g., HTTP status code errors)
      // You can show different messages based on error.response.status if needed
    }

    return Promise.reject(error);
  }
);

export { instance as axiosInstance };
