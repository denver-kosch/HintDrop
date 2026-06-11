import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useListDetailStyles } from '@/styles';
import { useCallback, useState } from 'react';
import { List, Gift } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import apiCall from '@/services/apiCall';
import EditListModal from '@/components/modals/editListModal';
import { useAppNavigation } from '@/hooks/appNav';


const ListDetailsPage = ({ route }: any) => {
    const { id } = route.params;
    const navigation = useAppNavigation();
    const styles = useListDetailStyles();
    const [list, setList] = useState<List | null>(null);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    if (loading) return <View><Text>Loading...</Text></View>;

    const fetchList = async () => {
        await apiCall(`/lists/${id}`)
        .then((listContent: any) => {
            setGifts(listContent.gifts);
            setList(listContent.list);
        }).catch(err => console.error("Error getting list details:", err));
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchList();
            setLoading(false);
        }, [route])
    );


    const GiftRow = ({gift}: {gift: Gift}) => (
        <View style={styles.gift}>
            <Text style={styles.text} onPress={() => { navigation.navigate("GiftDetail", { id: gift.id })}}>{gift.name}</Text>
        </View>
);

    const ListOption = ({option}: {option: {name: string, fn: () => void}}) => <TouchableOpacity onPress={option.fn} style={styles.option}><Text style={styles.optionText} >{option.name}</Text></TouchableOpacity>;

    const options = [
        {name: "Add Item", fn: () => navigation.navigate("AddGift", {listId: id, listName: list?.name})},
        {name: "Edit", fn: () => setEditModalVisible(true)},
        {name: "Share", fn: () => {}},
    ];


    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Text style={styles.header}>{list?.name}</Text>
                
                {list?.role === "owner" ? <View style={styles.optionsRow}>
                    {options.map((option, idx) => <ListOption key={idx} option={option} />)}
                </View> : <View style={{marginTop: "6%"}}/>}

                <EditListModal visible={editModalVisible} setVisible={setEditModalVisible} fetchList={fetchList} />

                <ScrollView style={styles.giftContainer}>
                    {gifts.map(gift => <GiftRow key={gift.id} gift={gift} />)}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
};

export default ListDetailsPage;