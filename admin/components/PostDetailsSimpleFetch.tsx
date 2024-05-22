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
import { axiosInstance } from "../../api/server";

interface PostDetails {
  title: string;
  body: string;
  readCount: number;
  commentCount: number;
}

const fetchPostDetail = async (boardId: string, postId: string) => {
  const { data } = await axiosInstance.get(
    `line_works/boards/${boardId}/posts/${postId}`
  );
  return data;
};

const PostDetailsScreen: React.FC = () => {
  const route =
    useRoute<
      RouteProp<{ params: { boardId: string; postId: string } }, "params">
    >();
  const { postId, boardId } = route.params;
  const navigation = useNavigation<AppNavigationProp>();
  const [data, setData] = useState<PostDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const postData = await fetchPostDetail(boardId, postId);
        setData(postData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [boardId, postId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: isLoading ? "" : data ? data.title : t("error.noData"),
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
      headerTitleStyle: {
        fontWeight: "bold",
        fontSize: 24,
      },
    });
  }, [navigation, isLoading, data]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text>{t("error.unableToFetch")}</Text>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text>{t("error.noData")}</Text>
      </SafeAreaView>
    );
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
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
