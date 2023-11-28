import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../contexts/ThemeProvider";

const Loader = () => {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={theme.colors.pink500} />
    </View>
  );
};

export default Loader;
