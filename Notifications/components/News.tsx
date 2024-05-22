import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  RefreshControl,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Post } from "../../admin/types/post";
import { useNews } from "../hooks/useNews";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../AppScreens";
import Loader from "../../core/Components/Loader";
import NewsEmpty from "./NewsEmpty";
import { formatDate, getLocale } from "../../core/utils/formatDate";
import { Ionicons } from "@expo/vector-icons";
import author from "../../assets/images/links/authorize.png";
const NewsScreen = () => {
  const { t, i18n } = useTranslation();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const navigation = useNavigation<AppNavigationProp>();
  const { isLoading, data: news, refetch: refetchNews } = useNews();

  // Render each news item
  const renderItem = ({ item }: { item: Post }) => (
    <View key={item.postId} style={styles.card}>
      <Image source={author} style={styles.authorImage} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>{item.userName}</Text>
        <Text style={styles.date}>
          {formatDate(item.createdTime, getLocale(i18n.language))}
        </Text>
        {/* <Text style={styles.readCount}>{`${t("common.read")} ${
                item.readCount
              }`}</Text> */}
        {/* <Text style={styles.readCount}>{`${<MaterialCommunityIcons} ${
                item.readCount
              }`}</Text> */}
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() =>
            navigation.navigate("PostDetails", {
              postId: item.postId,
              boardId: item.boardId,
            })
          }
        >
          <Text style={styles.viewMoreText}>{t("news.view.viewMore")}</Text>
          <Ionicons name="arrow-forward" size={16} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add your data fetching logic here.
      await refetchNews();
    } catch (error) {
      console.error("Error refreshing news", error);
    } finally {
      // Wait for 3 seconds before setting refreshing to false
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, [refetchNews]);

  if (isLoading) {
    return <Loader />;
  }

  if (news === undefined) {
    return <NewsEmpty label={t("news.view.empty")} />;
  }

  return (
    <SafeAreaView style={[styles.container]}>
      {news.length > 0 ? (
        <FlatList
          data={news}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={renderItem}
          keyExtractor={(item) => item.postId}
        />
      ) : (
        <Text style={styles.noNewsText}>{t("news.view.empty")}</Text>
      )}
    </SafeAreaView>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    marginHorizontal: 16,
    flex: 1,
    // padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  authorImage: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginTop: 8,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  author: {
    fontSize: 18,
    color: "#666",
    // marginBottom: 10,
  },
  readCount: {
    fontSize: 14,
    color: "#666",
  },
  date: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  body: {
    fontSize: 14,
    color: "#666",
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  viewMoreText: {
    fontSize: 16,
    marginRight: 5,
    color: "#000",
  },

  newsItem: {
    padding: 20,
    // borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    // Add other styles for news item
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    // Add other styles for news title
  },
  noNewsText: {
    fontSize: 20,
    color: "grey",
    fontWeight: "600",
    textAlign: "center",
    // bottom: HEIGHT - 500
    marginBottom: 300,
    // Add other styles for 'no news yet' text
  },
});
