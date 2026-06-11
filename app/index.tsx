import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHomeStyles } from "@/styles"
import { useProfile } from "@/hooks/storeHooks";


export default function HomePage() {
	const { first_name: name } = useProfile();
	const styles = useHomeStyles();


	const NotLoggedInScreen = () => {
	// In Progress
	};


	const IndexContents = () => {
	return ( 
		<View style={{ width: '100%' }}>
			<Text style={styles.header}>Welcome{name ? ` ${name}` : ""}!</Text>

		</View>
	);
	}

	return (
	<SafeAreaView style={styles.safeArea} edges={['top']}>
		<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
		<IndexContents/>
		</ScrollView>
	</SafeAreaView>
	);
}
