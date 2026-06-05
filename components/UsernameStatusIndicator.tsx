import { Text, TextStyle, StyleProp } from "react-native";
import { UsernameStatus } from "@/hooks/useUsernameAvailablity";
import { useUSIStyles } from "@/styles";

const UsernameStatusIndicator = ({status}: { status: UsernameStatus }) => {
	const styles = useUSIStyles();
	switch (status) {
		case "checking":
			return <Text style={styles.status}>Checking...</Text>;
		case "available":
			return <Text style={[styles.status, styles.available]}>Username is available</Text>;
		case "taken":
			return <Text style={[styles.status, styles.taken]}>Username is taken</Text>;
		case "invalid":
			return <Text style={[styles.status, styles.invalid]}>Username must be at least 5 characters</Text>;
		default:
			return null;
	}
};

export default UsernameStatusIndicator;