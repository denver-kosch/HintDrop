import { Text, View, Image, TouchableOpacity, Animated, Easing, ScrollView, Settings } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useProfileStyles } from '@/styles';
import { useCallback, useState, useEffect } from 'react';
import apiCall from '@/services/apiCall';
import PFPModal from '../components/modals/editPfpModal';
import EditProfileModal from '../components/modals/editProfileModal';
import LoadingIcon from '../assets/images/loadingIcon.png';
import PageBreak from '@/components/pagebreak';
import NotificationsModal from '@/components/modals/notificationsModal';
import PasswordModal from '@/components/modals/editPasswordModal';
import { applyProfile, logout as lo } from '@/services/storeFuncs';
import { useProfile, useToken } from '@/hooks/storeHooks';
import { useAppNavigation } from '@/hooks/appNav';
import { ProfileSettingsRowProps } from '@/types';

const SettingsRow = ({styles, settings}: ProfileSettingsRowProps) => (
	<View style={styles.settingsContainer}>
		{settings.map(({label, onPress} : ({label: string, onPress: () => void}), index: number) => (
			<View key={index}>
				<TouchableOpacity style={styles.settingsRow} onPress={onPress}>
					<Text style={styles.settingsText}>{label}</Text>
				</TouchableOpacity>
			</View>
		))}
	</View>
);


const ProfilePage = () => {
	const navigation = useAppNavigation();
	const token = useToken();
	const styles = useProfileStyles();
	const profile = useProfile();
	const [pfpMdalVisible, setPfpModalVisible] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [loading, setLoading] = useState(true);
	const [ownedListsCount, setOwnedListsCount] = useState(0);
	const [sharedListsCount, setSharedListsCount] = useState(0);
	const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
	const [passwordModalVisible, setPasswordModalVisible] = useState(false);
	

	const spinValue = useState(new Animated.Value(0))[0];

	useEffect(() => {
	  Animated.loop(
		Animated.timing(spinValue, {
		  toValue: 2,
		  duration: 1500,
		  easing: Easing.linear,
		  useNativeDriver: true,
		})
	  ).start();
	}, [spinValue]);

	const spin = spinValue.interpolate({
	  inputRange: [0, 2],
	  outputRange: ['0deg','360deg']
	});

	const logout = () => {
		lo();
		navigation.navigate("Main", { screen: "Home" });
	};
	
	const fetchProfile = async () => {
		setLoading(true);
		await apiCall<any>('users/me')
			.then(response => {
				applyProfile(response.userData);
				setOwnedListsCount(response.ownedListsCount);
				setSharedListsCount(response.sharedListsCount);
			}).catch(err => console.error("Error fetching profile data:", err))
			.finally(() => setLoading(false));
	};

	useFocusEffect(
		useCallback(() => {
			if (token) {
				fetchProfile();
				return;
			}
			logout();
			setOwnedListsCount(0);
			setSharedListsCount(0);
			navigation.navigate("Main", { screen: "Home" });
		}, [token, navigation])
	);

	if (loading) return (
		<SafeAreaView style={styles.safeArea} edges={['top']}>
			<View style={styles.loadingContainer}>
			<Animated.View style={{ transform: [{ rotate: spin }], marginBottom: 20 }}>
				<Image source={LoadingIcon} style={{ width: 60, height: 60 }} />
			</Animated.View>
			<Text style={styles.text}>Loading profile...</Text>
			</View>
		</SafeAreaView>
	);

	const settings = [
		{ label: 'Edit Profile', onPress: () => setEditModalVisible(true) },
		{ label: 'Notification Settings', onPress: () => setNotificationsModalVisible(true) },
		{ label: 'Change Password', onPress: () => setPasswordModalVisible(true) },
		{ label: 'Logout', onPress: logout },
	];
	

	return (
		<SafeAreaView style={styles.safeArea} edges={['top']}>
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
				<Text style={styles.header}>Profile</Text>

				<Image
				source={profile.profilePic ? { uri: profile.profilePic } : undefined}
				style={styles.profilePic}
				resizeMode="cover"
				/>

				<TouchableOpacity style={styles.button} onPress={() => setPfpModalVisible(true)}>
					<Text style={styles.buttonText}>Change Photo</Text>
				</TouchableOpacity>

				<PFPModal visible={pfpMdalVisible} onClose={() => setPfpModalVisible(false)} fetchProfile={fetchProfile} />

				<Text style={styles.profileName}>
					{profile?.first_name} {profile?.last_name} (<Text style={{ fontStyle: 'italic' }}>@{profile?.username}</Text>)
				</Text>

				<View style={styles.statsRow}>
					<TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "List" })} style={styles.statItem}>
						<Text style={styles.statNumber}>{ownedListsCount}</Text>
						<Text style={styles.text}>Owned Lists</Text>
					</TouchableOpacity>
					
					<TouchableOpacity onPress={() => navigation.navigate("Main", { screen: "List" })} style={styles.statItem}>
						<Text style={styles.statNumber}>{sharedListsCount}</Text>
						<Text style={styles.text}>Shared Lists</Text>
					</TouchableOpacity>
				</View>

				<PageBreak />

				<EditProfileModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} profile={profile} fetchProfile={fetchProfile} />

				<NotificationsModal visible={notificationsModalVisible} onClose={() => setNotificationsModalVisible(false)} />
				
				<PasswordModal visible={passwordModalVisible} onClose={() => setPasswordModalVisible(false)} />
				
				<SettingsRow styles={styles} settings={settings} />
			</ScrollView>
		</SafeAreaView>
	);
};

export default ProfilePage;
