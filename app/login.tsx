import { useState, useCallback } from 'react';
import apiCall from '@/services/apiCall';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AuthResponse, LoginPageProps, RegisterPageProps } from '@/types';
import { useLoginStyles } from '@/styles';
import useUsernameAvailability from '@/hooks/useUsernameAvailablity';
import UsernameStatusIndicator from '@/components/usernameStatusIndicator';
import { login } from '@/services/storeFuncs';
import { useToken } from '@/hooks/storeHooks';
import { useAppNavigation } from '@/hooks/appNav';

const LoginContents = ({ styles, navigation }: LoginPageProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async () => {
        await apiCall<AuthResponse>('auth/login', { body: { email, password }, method: 'POST', auth: false })
            .then(response => {
                setEmail('');
                setPassword('');
                login(response);
                navigation.navigate("Main", { screen: "Home" });
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

const RegisterContents = ({ styles, navigation, setIsLogin }: RegisterPageProps) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {usernameStatus, isUsernameValid} = useUsernameAvailability({username});

    const handleSubmit = async () => {
        if (!isUsernameValid) {
            Alert.alert('Username must be at least 5 characters and available');
            return;
        }
        
        await apiCall<AuthResponse>('auth/register', { body: { email, username, password }, method: 'POST', auth: false })
            .then(response => {
                setEmail('');
                setUsername('');
                setPassword('');
                setIsLogin(true);
                login(response)
                navigation.navigate("Main", { screen: "Home" });
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


const LoginPage = () => {
    const token = useToken();
    const styles = useLoginStyles();
    const navigation = useAppNavigation();
    const [isLogin, setIsLogin] = useState(true);

    useFocusEffect(useCallback(() => { if (token) navigation.navigate("Main", { screen: "Home" }); console.log(typeof styles); }, [token, navigation]));

    const switchPage = () => setIsLogin(!isLogin);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.container}>
                    <Text style={styles.header}>{isLogin ? 'Login' : 'Register'}</Text>
                    {isLogin ? <LoginContents styles={styles} navigation={navigation}/> : <RegisterContents styles={styles} navigation={navigation} setIsLogin={setIsLogin} />}
                    <TouchableOpacity style={styles.secondaryButton} onPress={switchPage}>
                        <Text style={styles.secondaryButtonText}>{isLogin ? 'Switch to Register' : 'Switch to Login'}</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginPage;
