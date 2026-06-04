
export type RootStackParamList = {
    Home: undefined;
    List: undefined;
    Profile: undefined;
    Login: undefined;
    ListDetail: { id: string };
    CreateList: undefined;
    EditProfile: undefined;
    Register: undefined;
  };

export type AuthState = {
    auth: {
        token: string | null;
    }
};

export type Headers = {
    "Content-Type"?: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data';
    "Authorization"?: string;
    "Accept"?: string;
    "Access-Control-Allow-Origin"?: string;
    "Access-Control-Allow-Credentials"?: string;
    "Access-Control-Allow-Methods"?: string;
    "Access-Control-Allow-Headers"?: string;
};

export type ListType = {
    id: string;
    owner: string;
    name: string;
    description: string;
    lastUpdated?: string;
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