// storeHooks.ts

import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useToken = () => useSelector((state: RootState) => state.auth.token);
export const useProfile = () => useSelector((state: RootState) => state.user);
export const usenotifications_enabled = () => useSelector((state: RootState) => state.settings.notifications_enabled);