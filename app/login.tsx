import { useState, useCallback } from 'react';
import apiCall from '@/services/apiCall';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, AuthState } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginStyles } from '@/styles';
import useUsernameAvailability from '@/hooks/useUsernameAvailablity';
import UsernameStatusIndicator from '@/components/usernameStatusIndicator';
import { setToken } from '@/store';

const LoginPage = () => {
    const dispatch = useDispatch();
    const token = useSelector((state: AuthState) => state.auth.token);
    const styles = useLoginStyles();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isLogin, setIsLogin] = useState(true);

    useFocusEffect(useCallback(() => {if (token) navigation.navigate('Home');}, [token, navigation]));

    const switchPage = () => setIsLogin(!isLogin);

    const LoginContents = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const handleSubmit = async () => {
            await apiCall<{success: boolean, token: string}>('auth/login', { body: { email, password }, method: 'POST', auth: false })
                .then(response => {
                    setEmail('');
                    setPassword('');
                    dispatch(setToken(response.token));
                    navigation.navigate('Home');
            }).catch(err => {
                console.error("Login error:", err);
                Alert.alert("Login Error", err.message || 'An error occurred during login');
            });
        };

        return (
            <View style={styles.form}>
                <View style={styles.field}>
                    <Text style={styles.text}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.text}>Password:</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const RegisterContents = () => {
        const [email, setEmail] = useState('');
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const {usernameStatus, isUsernameValid} = useUsernameAvailability({username});

        const handleSubmit = async () => {
            if (!isUsernameValid) {
                Alert.alert('Username must be at least 5 characters and available');
                return;
            }
            
            await apiCall<{success: boolean, token: string}>('auth/register', { body: { email, username, password }, method: 'POST', auth: false })
                .then(response => {
                    setEmail('');
                    setUsername('');
                    setPassword('');
                    setIsLogin(true);
                    dispatch(setToken(response.token));
                    navigation.navigate('Home');
                }).catch(err => {
                    console.error("Registration error:", err);
                    Alert.alert("Registration Error", err.message || 'An error occurred during registration');
                });
        };

        return (
            <View style={styles.form}>
                <View style={styles.field}>
                    <Text style={styles.text}>Email:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.field}>
                    <Text style={styles.text}>Username:</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={text => setUsername(text)}
                        autoCapitalize="none"
                    />
                    <UsernameStatusIndicator status={usernameStatus} />
                </View>
                <View style={styles.field}>
                    <Text style={styles.text}>Password:</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.container}>
                    <Text style={styles.header}>{isLogin ? 'Login' : 'Register'}</Text>
                    {isLogin ? <LoginContents /> : <RegisterContents />}
                    <TouchableOpacity style={styles.secondaryButton} onPress={switchPage}>
                        <Text style={styles.secondaryButtonText}>{isLogin ? 'Switch to Register' : 'Switch to Login'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginPage;
