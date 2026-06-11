import { useListStyles } from '@/styles';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiCall from '@/services/apiCall';
import { List, ListBlockProps, ListPreviewProps } from '@/types';
import PageBreak from '@/components/pagebreak';
import { useToken } from '@/hooks/storeHooks';
import { useAppNavigation } from '@/hooks/appNav';

const ListPreview = ({ list, shared, styles, navigation }: ListPreviewProps) => {
	const { id, name, description, owner } = list;
	return (
		<TouchableOpacity onPress={() => navigation.navigate('ListDetail', { id })} style={styles.listPreview} key={id}>
			<View>
				<Text style={styles.listName}>{name}</Text>
				<Text style={styles.listDescription}>{description}</Text>
				{shared && <Text style={styles.listOwner}>Owner: {owner}</Text>}
			</View>
		</TouchableOpacity>
	)
};

const ListBlock = ({title, lists, shared, styles, navigation } : ListBlockProps) => {
	return (
		<View style={styles.listBlock}>
			<Text style={styles.blockHeader}>{title}</Text>
			<FlatList
				data={lists}
				keyExtractor={list => String(list.id)}
				renderItem={({item}) => <ListPreview list={item} shared={shared} styles={styles} navigation={navigation} />}
				ListEmptyComponent={<Text style={styles.emptyState}>No lists to display.</Text>}
			/>
		</View>
	)
};

const ListsPage = () => {
	const token = useToken();
	const styles = useListStyles();
	const navigation = useAppNavigation();
	const [lists, setLists] = useState<{ owned: List[], shared: List[] }>({ owned: [], shared: [] });
	const [gettingLists, setGettingLists] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setGettingLists(true);
			const fetchLists = async () => {
				const response = await apiCall<{lists: {owned: Array<List>, shared: Array<List>}}>('lists').then(response => setLists(response.lists)).catch(err => console.error("Error fetching lists:", err));
				setGettingLists(false);
				return response;
			}
			if (token) fetchLists();
			else setLists({ owned: [], shared: [] });
			setGettingLists(false);
		}, [token])
	);

	return (
	<SafeAreaView style={styles.safeArea} edges={['top']}>
	<View style={styles.container}>
		<View style={styles.topBar}>
			<Text style={[styles.header, {width: '50%'}]}>Lists</Text>
			<TouchableOpacity style={styles.plusButton} onPress={() => navigation.navigate('CreateList')} disabled={!token}>
				<Text style={styles.plusButtonText}>+</Text>
			</TouchableOpacity>
		</View>

		<ListBlock title="Your Lists:" lists={lists.owned} shared={false} styles={styles} navigation={navigation} />
		
		<PageBreak />
		
		<ListBlock title="Shared Lists:" lists={lists.shared} shared={true} styles={styles} navigation={navigation} />
	</View>
	</SafeAreaView>
	)
};

export default ListsPage;
