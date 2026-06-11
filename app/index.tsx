import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHomeStyles } from "@/styles"
import { useProfile } from "@/hooks/storeHooks";
import { HomePageProps } from "@/types";


const IndexContents = ({styles, name}: HomePageProps) => {
	return ( 
		<View style={{ width: '100%' }}>
			<Text style={styles.header}>Welcome{name ? ` ${name}` : ""}!</Text>
		</View>
	)
}

export default function HomePage() {
	const { first_name } = useProfile();
	const styles = useHomeStyles();


	const NotLoggedInScreen = () => {
	// In Progress
	};



	return (
	<SafeAreaView style={styles.safeArea} edges={['top']}>
		<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
		<IndexContents styles={styles} name={first_name} />
		</ScrollView>
	</SafeAreaView>
	);
}
