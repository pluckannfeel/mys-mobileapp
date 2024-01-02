import { useEffect, useState } from "react";

type WeatherDataProps = {
  temperature: number | "";
  weatherIcon: string | "";
  type: string | "";
  code: number | "";
  date: Date;
};

export const useWeatherAPI = (languageCode: string) => {
  const [weatherData, setWeatherData] = useState<WeatherDataProps>({
    temperature: "",
    weatherIcon: "",
    type: "",
    code: "",
    date: new Date(),
  });

  useEffect(() => {
    const fetchWeather = async () => {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=c9578687a50a434cae2135930230712&q=Yokohama&lang=${languageCode}&aqi=no`
      );
      const data = await response.json();

      setWeatherData({
        temperature: data.current.temp_c,
        weatherIcon: data.current.condition.icon,
        type: data.current.condition.text,
        code: data.current.condition.code,
        date: data.current.last_updated,
      });
    };

    fetchWeather();
  }, []);

  return weatherData;
};
