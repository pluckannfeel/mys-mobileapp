import axios, { AxiosInstance } from "axios";

// baseurl for every request change this when you go into deployment
// export const baseUrl = 'https://fkuy7wira5n3shbvxt3xy3wfqm0jhvzq.lambda-url.ap-northeast-1.on.aws/';
// go back to localhost url
// export const baseUrl = "http://192.168.3.168:8000/";
// export const baseUrl = "http://192.168.179.8:8000/";
export const baseUrl = "http://localhost:8000/";
export const googleMapApiKey = process.env.REACT_APP_GOOGLEMAP_APIKEY;
export const mysOrgCode = process.env.REACT_APP_MYSORG_CODE;

// console.log(googleMapApiKey)

const instance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  // headers: {
  //   'Content-Type': 'application/json', // Add any default headers you want to set
  //   // Add other headers if needed
  //   'Access-Control-Allow-Origin': '*',
  // },
});

export { instance as axiosInstance };
