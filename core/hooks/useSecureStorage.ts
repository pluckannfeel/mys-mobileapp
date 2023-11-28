
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export function useSecureStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    // Get the initial value from SecureStore
    const fetchStoredValue = async () => {
      try {
        const item = await SecureStore.getItemAsync(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.log(error);
        setStoredValue(initialValue);
      }
    };

    fetchStoredValue();
  }, [key, initialValue]);

  const setValue = async (value: T) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      await SecureStore.setItemAsync(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
