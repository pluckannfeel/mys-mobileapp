import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleSheet,
} from "react-native";
import { useTheme } from "../contexts/ThemeProvider";

interface LoadingButtonProps extends TouchableOpacityProps {
  loading: boolean;
  label: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  label,
  ...props
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.button,
        props.style,
        loading || props.disabled ? styles.disabled : null, {
          backgroundColor: theme.colors.pink400
        }
      ]}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // backgroundColor: "#f43f5e", // bg-rose-400
    padding: 16, // p-4
    borderRadius: 15, // rounded-2xl
    marginBottom: 12, // mb-3
    alignItems: "center", // make text center
    justifyContent: "center", // center loading indicator
    width: "100%", // w-full
  },
  text: {
    color: "#fff", // text-white
    textAlign: "center", // text-center
    fontWeight: "bold", // font-bold
    fontSize: 20, // text-xl
  },
  disabled: {
    opacity: 0.5,
  },
});

export default LoadingButton;
