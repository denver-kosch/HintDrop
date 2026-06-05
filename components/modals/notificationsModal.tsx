import apiCall from "@/services/apiCall";
import { useModalStyles } from "@/styles";
import { NotificationsModalProps } from "@/types";
import { useEffect, useState } from "react";
import { Modal, View, Text, Switch, TouchableOpacity, Alert } from "react-native";



const NotificationsModal: React.FC<NotificationsModalProps> = ({ visible, onClose, token }) => {
    const styles = useModalStyles();
	const [enabled, setEnabled] = useState(false);
	
	useEffect(() => { 
		const fetchSettings = async () => await apiCall< {userData: { notifications_enabled: boolean } }>('users/me', { body: { fields: ['notifications_enabled'] } })
			.then(response => setEnabled(response?.userData?.notifications_enabled));
		fetchSettings();
	 }, []);

	const changeEnabled = async (value: boolean) => {
		await apiCall<{ success: boolean, user: { notifications_enabled: boolean } }>('users/me', { body: { notifications_enabled: value }, method: 'PATCH' })
			.then(response => setEnabled(response.user.notifications_enabled))
			.catch(err => {
				console.error("Error updating notification settings:", err.message || err);
				Alert.alert('Update Failed', "An error occurred while updating notification settings. Please try again.");
			});
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