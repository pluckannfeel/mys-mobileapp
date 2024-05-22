import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Asset } from "expo-asset";
import { useTranslation } from "react-i18next";

import * as Linking from "expo-linking";

const BrandConcept = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const asset = Asset.fromModule(require("../../assets/images/mys_logo.png"));
        await asset.downloadAsync();
        setImageUri(asset.localUri);
      } catch (error) {
        console.error("Failed to load image", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, []);

  const openFile = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Unable to open URL");
      }
    } catch (error) {
      console.error("An error occurred", error);
      Alert.alert("Error", "Failed to open URL");
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loaderContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: imageUri as string }}
        style={styles.backgroundImage}
        imageStyle={styles.bgImageStyle} // Applying specific styles to the image
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Text style={styles.title}>
            {t("admin.drawer.menu.brandConcept")}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => openFile("https://ews-bucket.s3.ap-northeast-1.amazonaws.com/archive/MYS%E3%83%96%E3%83%A9%E3%83%B3%E3%83%89%E3%82%B3%E3%83%B3%E3%82%BB%E3%83%97%E3%83%88/mysbrandconcept.docx")} style={[styles.button, styles.blueButton]}>
              <Ionicons name="document-text" size={20} color="#fff" />
              <Text style={styles.buttonText}>DOC</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openFile('https://ews-bucket.s3.ap-northeast-1.amazonaws.com/archive/MYS%E3%83%96%E3%83%A9%E3%83%B3%E3%83%89%E3%82%B3%E3%83%B3%E3%82%BB%E3%83%97%E3%83%88/mysbrandconcept.pdf')} style={[styles.button, styles.orangeButton]}>
              <Ionicons name="document-text" size={20} color="#fff" />
              <Text style={styles.buttonText}>PDF</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default BrandConcept;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    height: 200, // Adjust the height as needed
  },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    padding: 20,
  },
  bgImageStyle: {
    resizeMode: "cover",
    top: 0,
    left: -60,
    transform: [{ scale: 0.85 }], // Scale up the image if necessary
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "right",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  blueButton: {
    backgroundColor: "#22B8CF",
  },
  orangeButton: {
    backgroundColor: "#FD7E14",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 5,
  },
});
