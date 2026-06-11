import { UserState } from "./store";

export type RootStackParamList = {
    Main: { screen?: "Home" | "List" | "Profile" | "Login" } | undefined;
    Login: undefined;
    ListDetail: { id: number };
    CreateList: undefined;
    EditProfile: undefined;
    Register: undefined;
    GiftDetail: { id: number };
    AddGift: { listId: number, listName: string | any };
};

export type AuthState = {
    auth: {
        token: string | null;
    }
};

export type AuthResponse = {
	success: boolean;
	token: string;
	profile: {
		username: string;
		first_name: string;
		last_name: string;
		phone_num: string;
		email: string;
		profilePic: string;
		notifications_enabled: boolean;
	};
}

export interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    profile: UserState;
    fetchProfile: () => void;
}

export interface NotificationsModalProps {
    visible: boolean;
    onClose: () => void;
}

export interface PasswordModalProps {
    visible: boolean;
    onClose: () => void;
}

export type UserProfile = {
    first_name?: string;
    last_name?: string;
    phone_num?: string;
    username?: string;
    profilePic?: string;
    email?: string;
    notifications_enabled?: boolean;
};

export type List = {
    id: number;
    name?: string;
    description?: string;
    is_shareable?: boolean;
    owner?: string;
    role?: string;
};

export type Gift = {
    id: number;
    name?: string;
    description?: string;
    price?: number;
    url?: string;
    image_url?: string;
    quantity?: number;
    priority?: number;
    reservedBy?: UserProfile;
}