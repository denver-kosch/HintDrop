import { NavigationProp } from "@react-navigation/native";
import { UserState } from "./store";
import { HomeStylesProps, ListDetailStylesProps, ListStylesProps, LoginStylesProps, ProfileStylesProps } from "./styles";

export type RootStackParamList = {
    Main: { screen: "Home" | "List" | "Profile" | "Login" };
    Login: undefined;
    ListDetail: { id: number };
    CreateList: undefined;
    EditProfile: undefined;
    Register: undefined;
    GiftDetail: { id: number };
    AddGift: { listId: number, listName: string | any };
};

export type LoginPageProps = {
    styles: LoginStylesProps;
    navigation: NavigationProp<RootStackParamList>
};

export type RegisterPageProps = LoginPageProps & {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export type HomePageProps = {
    styles: HomeStylesProps;
    name: string | null;
};

export type GiftRowProps = {
    gift: Gift;
    styles: ListDetailStylesProps;
    navigation: NavigationProp<RootStackParamList>;
};

export type ListOptionProps = {
    option: {
        name: string, 
        fn: () => void
    },
    styles:ListDetailStylesProps
};

export type ListPreviewProps = {
    styles: ListStylesProps;
    list: List;
    shared: boolean;
    navigation: NavigationProp<RootStackParamList>;
};

export type ListBlockProps = {
    styles: ListStylesProps;
    title: string;
    lists: List[];
    shared: boolean;
    navigation: NavigationProp<RootStackParamList>;
};

export type ProfileSettingsRowProps = {
    styles: ProfileStylesProps;
    settings: {
        label: string;
        onPress: () => void;
    }[];
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
};

type ModalProps = {
    visible: boolean;
    onClose: () => void;
};

export type EditProfileModalProps = ModalProps & {
    profile: UserState;
    fetchProfile: () => void;
};

export type NotificationsModalProps = ModalProps;

export type PasswordModalProps = ModalProps;

export type EditListModalProps = ModalProps & {
  fetchList: () => void;
};

export type PFPModalProps = ModalProps & {
    fetchProfile: () => void;
};

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
};