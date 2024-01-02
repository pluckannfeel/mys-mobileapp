import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { HEIGHT } from "../constants/dimensions";

// Define the news item type
type NewsItem = {
  id: string;
  title: string;
  // Add other properties as needed
};

// Define the props for NewsFeed component
type NewsFeedProps = {
  news: NewsItem[];
};

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  const { t } = useTranslation();

  // Render each news item
  const renderItem = ({ item }: { item: NewsItem }) => (
    <View style={styles.newsItem}>
      <Text style={styles.newsTitle}>{item.title}</Text>
      {/* Render other news item details here */}
    </View>
  );

  return (
    <View style={styles.container}>
      {news.length > 0 ? (
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.noNewsText}>{t("news.view.empty")}</Text>
      )}
    </View>
  );
};

export default NewsFeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  newsItem: {
    padding: 20,
    borderBottomWidth: 1,
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
