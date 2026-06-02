import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store.js';
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import Index from "./index";
import NotFoundScreen from './+not-found';
import List from './lists';
import ProfilePage from './profile';
import LoginPage from './login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeIcon, ListIcon, ProfileIcon } from '@/hooks/icons';
import { useEffect, useState } from 'react';
import CreateList from './createList';
import ListDetail from './listDetail';
import { COLORS } from '../styles';


const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const TabNavigator = () => {
	const colorScheme = useColorScheme();
	const [token, setToken] = useState(store.getState().auth.token);

	// Subscribe to store updates for token changes
	useEffect(() => {
		const unsubscribe = store.subscribe(() => {
			const newToken = store.getState().auth.token;
			setToken(newToken);
		});

		return () => unsubscribe();
	}, []);

	return (

		<Tabs.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => {
					switch (route.name) {
						case 'Home': return <HomeIcon color={color} size={size} />;
						case 'List': return <ListIcon color={color} size={size} />;
						case 'Profile': return <ProfileIcon color={color} size={size} />;
					}
				},
				tabBarActiveTintColor: COLORS.glowBlue,
				tabBarInactiveTintColor: colorScheme === 'dark' ? COLORS.muted : COLORS.dimGray,
				tabBarStyle: {
					backgroundColor: colorScheme === 'dark' ? COLORS.void : COLORS.offWhite,
					borderTopColor: colorScheme === 'dark' ? COLORS.graphite : '#D8D8DF',
					borderTopWidth: 1,
				},
			})}
		>
			<Tabs.Screen name="Home" options={{ headerShown: false }} component={Index} />
			<Tabs.Screen name="List" options={{ headerShown: false }} component={List} />
			<Tabs.Screen
				name="Profile"
				options={{
					headerShown: false,
					tabBarLabel: token ? 'Profile' : 'Login', // Change label dynamically
				}}
				component={token ? ProfilePage : LoginPage} // Change component dynamically
			/>
		</Tabs.Navigator>
	);
};

const Screens = [
	{ name: 'Main', component: TabNavigator, options: { headerShown: false } },
	{ name: 'List', component: List, options: { headerShown: false } },
	{ name: 'CreateList', component: CreateList, options: { headerShown: false } },
	{ name: 'ListDetail', component: ListDetail, options: { headerShown: false } },
	{ name: '+not-found', component: NotFoundScreen },
];


export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
  	<Provider store={store}>
		<PersistGate loading={<ActivityIndicator/>} persistor={persistor}>
			<SafeAreaProvider>
				<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
					<Stack.Navigator>
						{Screens.map(({ name, component, options }) => (
							<Stack.Screen key={name} name={name} component={component} options={options} />
						))}
					</Stack.Navigator>
					<StatusBar style="auto" />
				</ThemeProvider>
			</SafeAreaProvider>
		</PersistGate>
	</Provider>
  );
}