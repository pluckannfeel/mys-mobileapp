import React, { createContext, useState, useEffect, ReactNode } from 'react';
import * as Network from 'expo-network';
import Toast from 'react-native-toast-message';

// Define the type for the context value
interface NetworkContextValue {
  isConnected: boolean;
}

// Create Context with a default value
export const NetworkContext = createContext<NetworkContextValue>({ isConnected: true });

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const checkNetwork = async () => {
      const state = await Network.getNetworkStateAsync();
      const isConnectedNow = state.isConnected ?? false;

      // If there is a change in network state and it's not connected, show the toast
      if (isConnected !== isConnectedNow && !isConnectedNow) {
        Toast.show({
          type: 'error',
          text1: 'No Internet Connection',
          text2: 'Please check your network settings.'
        });
      }

      setIsConnected(isConnectedNow);
    };

    checkNetwork();

    // Optional: Add event listener for network state changes
    // ...

    return () => {
      // Clean up the event listener
      // ...
    };
  }, [isConnected]);

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};
