import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import RenderHtml from "react-native-render-html";
import { useTranslation } from "react-i18next";
import { usePostDetails } from "../hooks/usePostDetails"; // Adjust path as necessary
import {
  RouteProp,
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

// Assuming these types are defined and imported from elsewhere
import { AppNavigationProp } from "../../AppScreens";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "../../core/theme/theme";
import Loader from "../../core/Components/Loader";

const PostDetailsScreen: React.FC = () => {
  const route =
    useRoute<
      RouteProp<{ params: { boardId: string; postId: string } }, "params">
    >();
  const { postId, boardId } = route.params;
  const navigation = useNavigation<AppNavigationProp>();
  const { data, isLoading, error } = usePostDetails({ postId, boardId });

  const { t } = useTranslation();

  useLayoutEffect(() => {
    if (isLoading) {
      navigation.setOptions({
        headerTransparent: true,
        headerTitle: "",
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(StackActions.pop())}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        ),
      });
    } else if (data) {
      navigation.setOptions({
        headerTransparent: true,
        headerTitle: data.title,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 24,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(StackActions.pop())}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, isLoading, data]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Text>{t("error.unableToFetch")}</Text>;
  }

  if (!data) {
    return <Text>{t("error.noData")}</Text>;
  }

  const contentWidth = Dimensions.get("window").width - 20;

  const tagsStyles = {
    div: {
      marginTop: 20,
      fontSize: 24,
    },
    img: {
      width: "100%",
      height: "auto",
    },
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <RenderHtml
          contentWidth={contentWidth}
          source={{ html: data.body }}
          tagsStyles={tagsStyles}
        />
        <Text style={styles.details}>
          {`${t("common.read")}: ${data.readCount}`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  details: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    color: "gray",
  },
});
