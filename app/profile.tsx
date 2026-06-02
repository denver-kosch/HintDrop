import { Text, View, Image, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileStyles } from '@/styles';
import { useCallback, useState, useEffect } from 'react';
import apiCall from '@/services/apiCall';
import PFPModal from '../components/editPfpModal';
import EditProfileModal from '../components/editProfileModal';
import LoadingIcon from '../assets/images/loadingIcon.png';

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
        const response = await apiCall(
            'getProfileInfo', {},
            {"Authorization": `Bearer ${token}`}
        );
        setLoading(false);
        if (!response?.success) return;
        setProfile(response.userData);
        setOwnedListsCount(response.ownedListsCount);
        setSharedListsCount(response.sharedListsCount);
    };

    useFocusEffect(
        useCallback(() => {
            if (!token) navigation.navigate('Home');
            fetchProfile();
        }, [token, navigation])
    );


    const logout = () => {
        dispatch({ type: 'REMOVE_TOKEN' });
        navigation.navigate('Home');
    };

    if (loading) return (
        <View style={styles.container}>
          <Animated.View style={{ transform: [{ rotate: spin }], marginBottom: 20 }}>
            <Image source={LoadingIcon} style={{ width: 60, height: 60 }} />
          </Animated.View>
          <Text style={styles.text}>Loading profile...</Text>
        </View>
      );
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile</Text>

            <Image
              source={profile?.profilePic ? { uri: profile.profilePic } : undefined}
              style={styles.profilePic}
              resizeMode="cover"
            />

            <TouchableOpacity style={styles.button} onPress={() => setPfpModalVisible(true)}>
                <Text style={styles.text}>Change Photo</Text>
            </TouchableOpacity>

            <PFPModal visible={pfpMdalVisible} setVisible={setPfpModalVisible} fetchProfile={fetchProfile} token={token} />

            <Text style={[styles.text, {fontWeight: "bold", fontSize: 20, paddingBottom: 20}]}>
                {profile?.first_name} {profile?.lastName} <Text style={{ fontStyle: 'italic' }}>(@{profile?.username})</Text>
            </Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingBottom: 20 }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.text, { fontWeight: 'bold', fontSize: 18 }]}>{ownedListsCount}</Text>
                    <Text style={styles.text}>Owned Lists</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.text, { fontWeight: 'bold', fontSize: 18 }]}>{sharedListsCount}</Text>
                    <Text style={styles.text}>Shared Lists</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => setEditModalVisible(true)}>
                <Text style={styles.text}>Edit Profile</Text>
            </TouchableOpacity>

            <EditProfileModal visible={editModalVisible} onClose={() => setEditModalVisible(false)} token={token} profile={profile} fetchProfile={fetchProfile} />

            <TouchableOpacity onPress={logout}>
                <Text style={styles.text}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfilePage;