
export type RootStackParamList = {
    Home: undefined;
    List: undefined;
    Profile: undefined;
    Login: undefined;
    ListDetail: { id: number };
    CreateList: undefined;
    EditProfile: undefined;
    Register: undefined;
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
    name?: string;
    description?: string;
    price?: number;
    url?: string;
    image_url?: string;
    quantity?: number;
    priority?: number;
    reserved_by?: UserProfile;
}