import { useListStyles } from '@/styles';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { Suspense, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiCall from '@/services/apiCall';
import { RootStackParamList, AuthState, List } from '@/types';
import { useSelector } from 'react-redux';
import PageBreak from '@/components/pagebreak';
import LoadingIcon from '@/components/loadingIcon';



const ListsPage = () => {
	const styles = useListStyles();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const token = useSelector((state: AuthState) => state.auth.token);
	const [lists, setLists] = useState<{ owned: List[], shared: List[] }>({ owned: [], shared: [] });
	const [gettingLists, setGettingLists] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setGettingLists(true);
			const fetchLists = async () => {
				const response = await apiCall<{lists: {owned: Array<List>, shared: Array<List>}}>('lists')
				.then(response => setLists(response.lists))
				.catch(err => console.error("Error fetching lists:", err));
				setGettingLists(false);
				return response;
			};
			if (token) fetchLists();
			else setLists({ owned: [], shared: [] });
			setGettingLists(false);
		}, [token])
	);

	const ListPreview = ({ list, shared }: { list: List, shared: boolean }) => {
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

	const ListBlock = ({title, lists, shared } : { title: string, lists: List[], shared: boolean }) => {
		return (
			<View style={styles.listBlock}>
				<Text style={styles.blockHeader}>{title}</Text>
				<Suspense fallback={<ActivityIndicator size="large" color="#b8a96e" />}>
					{gettingLists ? <LoadingIcon/> :
					lists.length > 0 ? <ScrollView>{lists.map(list => <ListPreview key={list.id} list={list} shared={shared} />)}</ScrollView> :
					<Text style={styles.emptyState}>No lists to display.</Text>}
				</Suspense>
			</View>
		)
	};

	return (
	<SafeAreaView style={styles.safeArea} edges={['top']}>
	<View style={styles.container}>
		<View style={styles.topBar}>
			<Text style={[styles.header, {width: '50%'}]}>Lists</Text>
			<TouchableOpacity style={styles.plusButton} onPress={() => navigation.navigate('CreateList')}>
				<Text style={styles.plusButtonText}>+</Text>
			</TouchableOpacity>
		</View>

		<ListBlock title="Your Lists:" lists={lists.owned} shared={false}/>
		
		<PageBreak />
		
		<ListBlock title="Shared Lists:" lists={lists.shared} shared={true}/>
	</View>
	</SafeAreaView>
	)
};

export default ListsPage;
