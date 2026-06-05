import { configureStore } from "@reduxjs/toolkit";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    PersistConfig,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthState = {
    token: string | null;
};

const initialState: AuthState = {
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        removeToken: (state) => {
            state.token = null;
        },
    },
});

const persistConfig: PersistConfig<AuthState> = {
    key: "auth",
    storage: AsyncStorage,
};

const persistedAuthReducer = persistReducer<AuthState>(
    persistConfig,
    authSlice.reducer
);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
    devTools: true,
});

export const persistor = persistStore(store);

export const { setToken, removeToken } = authSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;