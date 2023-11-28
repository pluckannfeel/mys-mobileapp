import React, { createContext, useContext } from "react";
import { theme } from "../theme/theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeContext = createContext(theme);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
