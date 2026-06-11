import apiCall from "@/services/apiCall";
import { useGiftDetailStyles } from "@/styles";
import { Gift } from "@/types";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



function GiftDetailsPage({ route }: any) {
    const { id } = route.params;
    const styles = useGiftDetailStyles();
    const [loading, setLoading] = useState(false);
    const [gift, setGift] = useState<Gift | null>(null);

    useFocusEffect(
        useCallback(() => {
            const getGift = async () => {
                setLoading(true);
                await apiCall(`gifts/${id}`)
                .then((res: any) => {setGift(res.gift)})
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
            }
            getGift();
    }, [id]))

    if (loading) return <View><Text>Loading...</Text></View>;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Text style={styles.header}>{gift?.name}</Text>
                <Image source={ { uri: gift?.image_url }} resizeMode="contain" style={styles.giftImage} />
            </View>
        </SafeAreaView>
    )
}

export default GiftDetailsPage;