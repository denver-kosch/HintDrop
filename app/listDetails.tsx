import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useListDetailStyles } from '@/styles';
import { useCallback, useState } from 'react';
import { List, Gift, GiftRowProps, ListOptionProps } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import apiCall from '@/services/apiCall';
import EditListModal from '@/components/modals/editListModal';
import { useAppNavigation } from '@/hooks/appNav';

const GiftRow = ({gift, styles, navigation}: GiftRowProps) => (
    <View style={styles.gift}>
        <Text style={styles.text} onPress={() => { navigation.navigate("GiftDetail", { id: gift.id })}}>{gift.name}</Text>
    </View>
);

const ListOption = ({option, styles}: ListOptionProps) => <TouchableOpacity onPress={option.fn} style={styles.option}><Text style={styles.optionText} >{option.name}</Text></TouchableOpacity>;

const ListDetailsPage = ({ route }: any) => {
    const { id } = route.params;
    const navigation = useAppNavigation();
    const styles = useListDetailStyles();
    const [list, setList] = useState<List | null>(null);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [loading, setLoading] = useState<Boolean>(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const fetchList = async () => {
        setLoading(true);
        await apiCall(`/lists/${id}`)
        .then((listContent: any) => {
            setGifts(listContent.gifts);
            setList(listContent.list);
        }).catch(err => console.error("Error getting list details:", err))
        .finally(() => setLoading(false));
    };

    useFocusEffect(
        useCallback(() => {
            fetchList();
        }, [route])
    );


    const options = [
        {name: "Add Item", fn: () => navigation.navigate("AddGift", {listId: id, listName: list?.name})},
        {name: "Edit", fn: () => setEditModalVisible(true)},
        {name: "Share", fn: () => {}},
        {name: "Delete List", fn: () => {}}
    ];

    if (loading) return <View><Text>Loading...</Text></View>;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Text style={styles.header}>{list?.name}</Text>
                
                {list?.role === "owner" ? <View style={styles.optionsRow}>
                    {options.map((option, idx) => <ListOption key={idx} option={option} styles={styles} />)}
                </View> : <View style={{marginTop: "6%"}}/>}

                <EditListModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} fetchList={fetchList} />

                <FlatList style={styles.giftContainer}
                    data={gifts}
                    keyExtractor={(gift) => String(gift.id)}
                    renderItem={({ item }) => <GiftRow gift={item} styles={styles} navigation={navigation} />}
                />
            </View>
        </SafeAreaView>
    )
};

export default ListDetailsPage;