import { store, setProfile, clearProfile, setToken, removeToken, setTheme as sTheme, setNotifsEnabled } from "@/store";
import { UserProfile } from "@/types";

export const logout = () => {
  store.dispatch(removeToken());
  store.dispatch(clearProfile());
  store.dispatch(setNotifsEnabled(null));
};

export const applyProfile = (profile: UserProfile) => {
  const { notifications_enabled, ...userData } = profile;
  store.dispatch(setProfile(userData));
  if (notifications_enabled !== undefined) store.dispatch(setNotifsEnabled(notifications_enabled));
};

export const setAuthToken = (token: string) => store.dispatch(setToken(token));

export const setTheme = (theme: "light" | "dark" | "auto") => store.dispatch(sTheme(theme));

export const getToken = () => store.getState().auth.token ?? "";

export const login = ({token, profile}: { token: string, profile: UserProfile}) => {
  applyProfile(profile);
  setAuthToken(token);
}