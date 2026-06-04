import { useState, useCallback } from 'react';
import apiCall from '@/services/apiCall';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, AuthState } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginStyles } from '@/styles';

const noopSubmitEvent = { preventDefault: () => undefined };

const LoginPage = () => {
    const dispatch = useDispatch();
    const token = useSelector((state: AuthState) => state.auth.token);
    const styles = useLoginStyles();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');

    useFocusEffect(useCallback(() => {if (token) navigation.navigate('Home');}, [token, navigation]));

    const switchPage = () => {
        setIsLogin(!isLogin);
        setError('');
    };


    const LoginContents = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const handleSubmit = async (event: { preventDefault: () => void; }) => {
            event.preventDefault();
            setError('');

            const response = await apiCall('login', { email, password });

            if (response?.success) {
                setEmail('');
                setPassword('');
                dispatch({ type: 'SET_TOKEN', payload: response.token });
                navigation.navigate('Home');
            } else {
                setError(response?.error || 'An error occurred');
            }
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
                <TouchableOpacity style={styles.button} onPress={() => handleSubmit(noopSubmitEvent)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const RegisterContents = () => {
        const [email, setEmail] = useState('');
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');

        const handleSubmit = async (event: { preventDefault: () => void; }) => {
            event.preventDefault();
            setError('');
            
            if (username.trim().length < 5) {
                setError('Username must be at least 5 characters');
                return;
            }
            
            const response = await apiCall('register', { email, username, password });
            if (response?.success) {
                setEmail('');
                setUsername('');
                setPassword('');
                setIsLogin(true);
                dispatch({ type: 'SET_TOKEN', payload: response.token });
                navigation.navigate('Home');
            } else setError(response?.error || 'An error occurred');
            
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
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={() => handleSubmit(noopSubmitEvent)}>
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
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <TouchableOpacity style={styles.secondaryButton} onPress={switchPage}>
                        <Text style={styles.secondaryButtonText}>{isLogin ? 'Switch to Register' : 'Switch to Login'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginPage;
