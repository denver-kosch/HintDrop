import { useListStyles } from '@/styles';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';
import { Suspense, useCallback, useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import apiCall from '@/services/apiCall';
import { ListType, RootStackParamList, AuthState } from '@/types';
import { useSelector } from 'react-redux';
import PageBreak from '@/components/pagebreak';
import LoadingIcon from '../components/loadingIcon';



const List = () => {
	const styles = useListStyles();
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const token = useSelector((state: AuthState) => state.auth.token);
	const [lists, setLists] = useState<{ owned: ListType[], shared: ListType[] }>({ owned: [], shared: [] });
	const [gettingLists, setGettingLists] = useState(false);

	useFocusEffect(
		useCallback(() => {
			setGettingLists(true);
			const fetchLists = async () => {
				const response = await apiCall('getLists', {}, {"Authorization": `Bearer ${token}`});
				if (response.success) setLists(response.lists);
			};
			if (token) fetchLists();
			setGettingLists(false);
		}, [token])
	);

	const ListPreview = ({ list, shared }: { list: ListType, shared: boolean }) => {
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

	const ownedListPreviews = useMemo(() => lists.owned.map(list => <ListPreview key={list.id+"o"} list={list} shared={false} />), [lists.owned]);

	const sharedListPreviews = useMemo(() =>lists.shared.map(list => <ListPreview key={list.id+"s"} list={list} shared={true} />), [lists.shared]);

	return (
	<View style={styles.container}>
		<View style={styles.topBar}>
			<Text style={[styles.header, {width: '50%'}]}>Lists</Text>
			<TouchableOpacity onPress={() => navigation.navigate('CreateList')}>
				<Text style={[styles.button]}> + </Text>
			</TouchableOpacity>
		</View>
		<View style={styles.listBlock}>
			<Text style={styles.blockHeader}>Your Lists:</Text>
			<Suspense fallback={<ActivityIndicator size="large" color="#b8a96e" />}>
				{gettingLists ? <LoadingIcon/> :
				lists.owned.length > 0 ? <ScrollView>{ownedListPreviews}</ScrollView> :
				<Text style={[styles.text, {padding: 5}]}>You don't have any lists yet.</Text>}
			</Suspense>
		</View>
		<PageBreak />
		<View style={styles.listBlock}>
			<Text style={styles.blockHeader}>Shared Lists:</Text>
			<Suspense fallback={<ActivityIndicator size="large" color="#b8a96e" />}>
				{gettingLists ? <LoadingIcon/> :
				lists.shared.length > 0 ? <ScrollView>{sharedListPreviews}</ScrollView> :
				<Text style={[styles.text, {padding: 5, justifyContent: 'center'}]}>You haven't been shared any lists yet.</Text>}
			</Suspense>
		</View>
	</View>
	)
};

export default List;