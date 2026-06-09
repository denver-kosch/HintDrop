import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { View, Text, KeyboardAvoidingView } from "react-native";
import { useAddGiftStyles } from '@/styles';
import { SafeAreaView } from "react-native-safe-area-context";


const AddGiftPage = ({ route }: any) => {
    const { listId, listName } = route.params;
    const styles = useAddGiftStyles();
    const [giftName, setGiftName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState<number>(1);
    const [price, setPrice] = useState<number | null>(null);
    const [url, setUrl] = useState("");
    const [image, setImage] = useState<any>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            allowsEditing: true,
            quality: 1
        });

        if (result.canceled) return;
        const selectedImage = result.assets[0];
        setImage(selectedImage);
    };


    

    return(
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={styles.container}>
                <Text style={styles.header}>Add gift to "{listName}"</Text>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
};

export default AddGiftPage;