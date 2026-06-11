import { RootStackParamList } from "@/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';

export const useAppNavigation = () => useNavigation<StackNavigationProp<RootStackParamList>>();
