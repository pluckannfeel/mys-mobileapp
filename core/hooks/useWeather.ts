import { useQuery } from 'react-query';

type WeatherDataProps = {
  temperature: number | "";
  weatherIcon: string | "";
  type: string | "";
  code: number | "";
  date: Date;
};

const fetchWeather = async (languageCode: string): Promise<WeatherDataProps> => {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=c9578687a50a434cae2135930230712&q=Yokohama&lang=${languageCode}&aqi=no`
  );
  const data = await response.json();

  return {
    temperature: data.current.temp_c,
    weatherIcon: data.current.condition.icon,
    type: data.current.condition.text,
    code: data.current.condition.code,
    date: data.current.last_updated,
  };
};

export const useWeatherAPI = (languageCode: string) => {
  const { data, isLoading, error } = useQuery(['weather', languageCode], () => fetchWeather(languageCode), {
    enabled: !!languageCode, // Fetch only when languageCode is available
  });

  return { data, isLoading, error };
};
