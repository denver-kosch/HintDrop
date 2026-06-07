import { Text, View, Image, TouchableOpacity, Animated, Easing, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileStyles } from '@/styles';
import { useCallback, useState, useEffect } from 'react';
import apiCall from '@/services/apiCall';
import PFPModal from '../components/modals/editPfpModal';
import EditProfileModal from '../components/modals/editProfileModal';
import LoadingIcon from '../assets/images/loadingIcon.png';
import PageBreak from '@/components/pagebreak';
import NotificationsModal from '@/components/modals/notificationsModal';
import PasswordModal from '@/components/modals/editPasswordModal';
import { removeToken } from '@/store';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const token = useSelector((state: any) => state.auth.token);
    const styles = useProfileStyles();
    const [profile, setProfile] = useState<any>({});
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
    
    const fetchProfile = async () => {
        setLoading(true);
        await apiCall<any>('users/me')
            .then(response =>{
                setProfile(response.userData);
                setOwnedListsCount(response.ownedListsCount);
                setSharedListsCount(response.sharedListsCount);
            }).catch(err => console.error("Error fetching profile data:", err));
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            if (!token) {
                setProfile({});
                setOwnedListsCount(0);
                setSharedListsCount(0);
                navigation.navigate('Home');
            }
            else fetchProfile();
        }, [token, navigation])
    );


    const logout = () => {
        dispatch(removeToken());
        navigation.navigate('Home');
    };

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

    const settingsRow = (label: string, onPress: () => void) => (
        <TouchableOpacity style={styles.settingsRow} onPress={onPress}>
            <Text style={styles.settingsText}>{label}</Text>
        </TouchableOpacity>
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
              source={profile?.profilePic ? { uri: profile.profilePic } : undefined}
              style={styles.profilePic}
              resizeMode="cover"
            />

            <TouchableOpacity style={styles.button} onPress={() => setPfpModalVisible(true)}>
                <Text style={styles.buttonText}>Change Photo</Text>
            </TouchableOpacity>

            <PFPModal visible={pfpMdalVisible} setVisible={setPfpModalVisible} fetchProfile={fetchProfile} token={token} />

            <Text style={styles.profileName}>
                {profile?.first_name} {profile?.last_name} <Text style={{ fontStyle: 'italic' }}>(@{profile?.username})</Text>
            </Text>

            <View style={styles.statsRow}>
                <TouchableOpacity onPress={() => navigation.navigate("List")} style={styles.statItem}>
                    <Text style={styles.statNumber}>{ownedListsCount}</Text>
                    <Text style={styles.text}>Owned Lists</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("List")} style={styles.statItem}>
                    <Text style={styles.statNumber}>{sharedListsCount}</Text>
                    <Text style={styles.text}>Shared Lists</Text>
                </TouchableOpacity>
            </View>

            <PageBreak />

            <EditProfileModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} token={token} profile={profile} fetchProfile={fetchProfile} />

            <NotificationsModal visible={notificationsModalVisible} onClose={() => setNotificationsModalVisible(false)} token={token} />
            
            <PasswordModal visible={passwordModalVisible} onClose={() => setPasswordModalVisible(false)} token={token} />
            
            <View style={styles.settingsContainer}>
                {settings.map((setting, index) => (
                    <View key={index}>
                        {settingsRow(setting.label, setting.onPress)}
                        {index < settings.length - 1 && <View style={styles.divider} />}
                    </View>
                ))}
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default ProfilePage;
