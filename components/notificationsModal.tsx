import apiCall from "@/services/apiCall";
import { useModalStyles } from "@/styles";
import { NotificationsModalProps } from "@/types";
import { useEffect, useState } from "react";
import { Modal, View, Text, Switch, TouchableOpacity, Alert } from "react-native";



const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose, token }) => {
    const styles = useModalStyles();
	const [enabled, setEnabled] = useState(false);

	useEffect(() => {
		const fetchSettings = async () => {
			const response = await apiCall('users/me', { fields: ['notifications_enabled'] }, { "Authorization": `Bearer ${token}` }, 'GET');
			if (response?.success) setEnabled(response.userData.notifications_enabled);
		};
		fetchSettings();
	}, [enabled]);

	const changeEnabled = async (value: boolean) => {
		const response = await apiCall('users/me', { notifications_enabled: value }, { "Authorization": `Bearer ${token}` }, 'PATCH');
		if (!response?.success) Alert.alert('Update Failed', "Failed to update notification settings. Please try again.");
		else setEnabled(value);
	};

	return (
		<Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose} >
			<View style={styles.modalBackdrop}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Notification Settings</Text>
					<Text style={[styles.label, {textAlign: 'center', width: "100%"}]}>Notifications are currently {enabled ? 'enabled' : 'disabled'}.</Text>
					<View style={{width: "100%" }}><Switch value={enabled} onValueChange={changeEnabled} style={{alignSelf: "center"}}/></View>
					<TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
						<Text style={styles.secondaryButtonText}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

export default NotificationsModal;