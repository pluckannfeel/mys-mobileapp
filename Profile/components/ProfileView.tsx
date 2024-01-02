import React from 'react';
import { StyleSheet, Image, TouchableOpacity, Modal, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

type ProfileViewProps = {
  imageUrl: string;
  isVisible: boolean;
  onClose: () => void;
};

const ProfileView: React.FC<ProfileViewProps> = ({ imageUrl, isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      transparent={false}
      animationType="slide"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <AntDesign name="close" size={24} color="white" />
        </TouchableOpacity>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

export default ProfileView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // You can change the background color
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 44, // Adjust the value as needed for status bar height
    left: 16,
    zIndex: 10, // Make sure the button is above other UI elements
  },
});
