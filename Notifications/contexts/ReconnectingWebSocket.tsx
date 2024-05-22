import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface WebSocketContextType {
  notifications: any[]; // Define the type for your notifications
}

const defaultContextValue: WebSocketContextType = {
  notifications: [],
};

const WebSocketContext = createContext<WebSocketContextType>(defaultContextValue);

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]); // Update this to the correct type for notifications
  const maxReconnectAttempts = 5;
  let reconnectAttempts = 0;

  const connectWebSocket = () => {
    const newWs = new WebSocket('your-websocket-url');

    newWs.onopen = () => {
      console.log('WebSocket Connected');
      reconnectAttempts = 0;
    };

    newWs.onmessage = (event) => {
      // Handle incoming messages
      // Example: setNotifications([...notifications, JSON.parse(event.data)]);
    };

    newWs.onclose = () => {
      console.log('WebSocket Disconnected');
      if (reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttempts++;
          connectWebSocket();
        }, Math.pow(2, reconnectAttempts) * 1000);
      }
    };

    newWs.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    setWs(newWs);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      ws?.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ notifications }}>
      {children}
    </WebSocketContext.Provider>
  );
};
