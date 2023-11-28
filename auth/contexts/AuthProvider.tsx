import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  startTransition,
} from "react";
import { useSecureStorage } from "../../core/hooks/useSecureStorage";
import { useLogin } from "../hooks/useLogin";
import { useLogout } from "../hooks/useLogout";
import { useUserInfo } from "../hooks/useUserInfo";
import { UserInfo } from "../types/userInfo";

interface AuthContextInterface {
  // hasRole: (roles?: string[]) => {};
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  userInfo?: UserInfo;
  onBoarding: boolean;
  setOnBoarding: (onBoarding: boolean) => void;
}

export const AuthContext = createContext({} as AuthContextInterface);

type AuthProviderProps = {
  children?: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authKey, setAuthKey] = useSecureStorage<string>("authkey", "");

  // Onboarding data
  const [onBoarding, setOnboarding] = useSecureStorage<boolean>(
    "onboarding",
    false
  );

  const { isLoggingIn, login } = useLogin();
  const { isLoggingOut, logout } = useLogout();
  const { data: userInfo } = useUserInfo(authKey);

  // const hasRole = (roles?: string[]) => {
  //   if (!roles || roles.length === 0) {
  //     return true;
  //   }
  //   if (!userInfo) {
  //     return false;
  //   }
  //   return roles.includes(userInfo.role);
  // };

  const handleLogin = async (staff_code: string, password: string) => {
    return login({ staff_code, password })
      .then((key: string) => {
        // console.log(key)
        setAuthKey(key);
        return key;
      })
      .catch((err) => {
        // throw err;]
        console.log("Error Logging in: ", err);
      });
  };

  const handleLogout = async () => {
    return logout()
      .then((data) => {
        setAuthKey("");
        return data;
      })
      .catch((err) => {
        // throw err;
        console.log("Error Logging out: ", err);
      });
  };

  const handleSetOnBoarding = (onBoarding: boolean) => {
    if (typeof onBoarding === "boolean") {
      setOnboarding(onBoarding);
    }
  };

  // context optimization
  const value = useMemo(
    () => ({
      isLoggingIn,
      isLoggingOut,
      login: handleLogin,
      logout: handleLogout,
      userInfo,
      onBoarding,
      setOnBoarding: handleSetOnBoarding,
    }),
    [isLoggingIn, isLoggingOut, userInfo, onBoarding]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
