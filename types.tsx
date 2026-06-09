
export type RootStackParamList = {
    Main: {
        screen?: "Home" | "List" | "Profile" | "Login";
    };
    Login: undefined;
    ListDetail: { id: number };
    CreateList: undefined;
    EditProfile: undefined;
    Register: undefined;
    GiftDetail: { id: number };
    AddGift: { listId: number, listName: string | any};
  };

export type AuthState = {
    auth: {
        token: string | null;
    }
};

export interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    token: string;
    profile?: {
        first_name: string;
        last_name: string;
        phone_num: string;
        username: string;
    };
    fetchProfile: () => void;
}

export interface NotificationsModalProps {
    visible: boolean;
    onClose: () => void;
    token: string;
}

export interface PasswordModalProps {
    visible: boolean;
    onClose: () => void;
    token: string;
}

export type UserProfile = {
    first_name?: string;
    last_name?: string;
    phone_num?: string;
    username?: string;
    profilePic?: string;
    email?: string;
    notificationsEnabled?: boolean;
};

export type List = {
    id: number;
    name?: string;
    description?: string;
    is_shareable?: boolean;
    owner?: string;
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