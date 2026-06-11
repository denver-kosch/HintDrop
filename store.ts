import { configureStore } from "@reduxjs/toolkit";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, PersistConfig } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = { token: string | null };

export type UserState = {
	username: string | null;
	first_name: string | null;
	last_name: string | null;
	phone_num: string | null;
	email: string | null;
	profilePic: string | null;
};

export type SettingsState = {
	theme: "auto" | "light" | "dark";
	notifications_enabled: boolean | null;
};

const initialAuthState: AuthState = { token: null };

const initialUserState: UserState = {
	username: null,
	first_name: null,
	last_name: null,
	phone_num: null,
	email: null,
	profilePic: null,
};

const initialSettingsState: SettingsState = {
	theme: "auto",
	notifications_enabled: null
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialAuthState,
	reducers: {
		setToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
		removeToken: () => initialAuthState,
	},
});

const userSlice = createSlice({
	name: "user",
	initialState: initialUserState,
	reducers: {
		setProfile: (state, action: PayloadAction<Partial<UserState>>) => { Object.assign(state, action.payload); },
		clearProfile: () => initialUserState,
	}
});

const settingsSlice = createSlice({
	name: "settings",
	initialState: initialSettingsState,
	reducers: {
		setTheme: (state, action: PayloadAction<SettingsState['theme']>) => { state.theme = action.payload; },
		setNotifsEnabled: (state, action: PayloadAction<boolean | null>) => { state.notifications_enabled = action.payload; },
	}
});

const persistAuthConfig: PersistConfig<AuthState> = { key: "auth", storage: AsyncStorage };

const persistUserConfig: PersistConfig<UserState> = { key: "user", storage: AsyncStorage };

const persistSettingsConfig: PersistConfig<SettingsState> = { key: "settings", storage: AsyncStorage };

const persistedAuthReducer = persistReducer<AuthState>(persistAuthConfig, authSlice.reducer);
const persistedUserReducer = persistReducer<UserState>(persistUserConfig, userSlice.reducer);
const persistedSettingsReducer = persistReducer<SettingsState>(persistSettingsConfig, settingsSlice.reducer);

export const store = configureStore({
	reducer: {
		auth: persistedAuthReducer,
		user: persistedUserReducer,
		settings: persistedSettingsReducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: { ignoredActions: [ FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER ] }}),
	devTools: true,
});

export const persistor = persistStore(store);

export const { setToken, removeToken } = authSlice.actions;
export const { setProfile, clearProfile } = userSlice.actions;
export const { setTheme, setNotifsEnabled } = settingsSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;