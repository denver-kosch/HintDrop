import { FC, useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, Alert, Touchable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import apiCall from "@/services/apiCall";
import { useModalStyles } from "@/styles";

type PFPModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  fetchProfile: () => void;
  token: string;
};

const PFPModal: FC<PFPModalProps> = ({ visible, setVisible, fetchProfile, token }) => {
    const styles = useModalStyles();
    const [image, setImage] = useState<any | null>(null);

    const updateProfilePic = async (imageToUpload: any) => {
        if (!imageToUpload) return;

        const formData = new FormData();
        formData.append('image', {
            uri: imageToUpload.uri,
            name: 'profile.png',
            type: 'image/png'
        } as any);
        await apiCall('users/me/profile-picture', { body: formData, headers: { "Content-Type": 'multipart/form-data' }, method: 'PATCH' })
            .then(response => fetchProfile())
            .catch(err => {
                console.error("Failed to update profile picture:", err);
                Alert.alert('Update Failed', "Failed to update profile picture. Please try again.");
            })
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            quality: 1,
            aspect: [1, 1]
        });

        if (result.canceled) return;
        const selectedImage = result.assets[0];
        setImage(selectedImage);
    };
    
    const submitImage = async () => {
        setVisible(false);
        await updateProfilePic(image);
        setImage(null);
    };
    
    return <>
    <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
    >
        <View style={styles.modalBackdrop}>
        <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Profile Picture</Text>

            <TouchableOpacity onPress={pickImage}>
                {image ? (
                <Image source={{ uri: image.uri }} style={styles.previewImage} />
                ) : (
                <View style={styles.placeholderShape}>
                    <Text style={[styles.placeholderText, {textAlign: 'center'}]}>Tap here to Change Image</Text>
                </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={submitImage}>
            <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setVisible(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </View>
        </View>
    </Modal>
    </>;
};

export default PFPModal;