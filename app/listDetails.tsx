import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useListDetailStyles } from '@/styles';
import { useCallback, useState } from 'react';
import { List, Gift, RootStackParamList } from '@/types';
import { NavigationProp, useFocusEffect } from '@react-navigation/native';
import apiCall from '@/services/apiCall';
import { useNavigation } from 'expo-router';


const ListDetailsPage = ({ route }: any) => {
    const { id } = route.params;
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const styles = useListDetailStyles();
    const [list, setList] = useState<List | null>(null);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);


    useFocusEffect(
        useCallback(() => {
            const getListDetails = async () => {
                await apiCall(`/lists/${id}`)
                .then((listContent: any) => {
                    setGifts(listContent.gifts);
                    setList(listContent.list);
                })
                .catch(err => {
                    console.error("Error getting list details:", err);
                    // navigation.navigate("Main", { screen: "List" });
                });
            };
            setLoading(true);
            getListDetails();
            setLoading(false);
        }, [route])
    );

    if (loading) return <View><Text>Loading...</Text></View>;

    const GiftRow = ({gift}: {gift: Gift}) => <Text style={styles.text} onPress={() => { navigation.navigate("GiftDetail", { id: gift.id })}}>{gift.name}</Text>;

    const ListOption = ({option, fn}: {option: string, fn: () => void}) => <TouchableOpacity onPress={fn}><Text style={styles.option} >{option}</Text></TouchableOpacity>;

    const options = [
        {name: "Add Item", fn: () => navigation.navigate("AddGift", {listId: id, listName: list?.name})},
        {name: "Edit", fn: () => {}},
        {name: "Share", fn: () => {}},
    ];


    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Text style={styles.header}>{list?.name}</Text>
                
                <View style={styles.optionsRow}>
                    {options.map((option, idx) => <ListOption key={idx} option={option.name} fn={option.fn} />)}
                </View>

                <ScrollView>
                    {gifts.map(gift => <GiftRow key={gift.id} gift={gift} />)}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
};

export default ListDetailsPage;