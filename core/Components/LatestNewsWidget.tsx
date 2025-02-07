import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { formatDate, getLocale } from "../utils/formatDate";
import { Post } from "../../admin/types/post";
import NewsEmpty from "../../Notifications/components/NewsEmpty";
import { theme } from "../theme/theme";
import { useNavigation } from "@react-navigation/native";
import { AppNavigationProp } from "../../AppScreens";
import author from "../../assets/images/links/authorize.png";

type LatestNewsWidgetProps = {
  data: Post[];
  loading: boolean;
  refetch: () => void;
};

const LatestNewsWidget = ({
  data,
  loading,
  refetch,
}: LatestNewsWidgetProps) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<AppNavigationProp>();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.pink500} />
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>{t("admin.drawer.menu.latestNews")}</Text>
          <TouchableOpacity onPress={refetch}>
            <Ionicons name="reload" size={26} color={theme.colors.primary}/>
          </TouchableOpacity>
        </View>
        <NewsEmpty label={t("news.view.empty")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{t("admin.drawer.menu.latestNews")}</Text>
        <TouchableOpacity onPress={refetch}>
          <Ionicons name="reload" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {data.map((item) => (
          <View key={item.postId} style={styles.card}>
            <Image source={author} style={styles.authorImage} />
            <View style={styles.content}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.author}>{item.userName}</Text>
              <Text style={styles.date}>
                {formatDate(item.createdTime, getLocale(i18n.language))}
              </Text>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() =>
                  navigation.navigate("PostDetails", {
                    postId: item.postId,
                    boardId: item.boardId,
                  })
                }
              >
                <Text style={styles.viewMoreText}>
                  {t("news.view.viewMore")}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default LatestNewsWidget;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingRight: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
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
});
