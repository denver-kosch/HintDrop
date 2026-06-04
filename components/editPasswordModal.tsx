import apiCall from "@/services/apiCall";
import { useModalStyles } from "@/styles";
import { PasswordModalProps } from "@/types";
import { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";


const PasswordModal: React.FC<PasswordModalProps> = ({ visible, onClose, token }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const styles = useModalStyles();

    const wipeModal = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
    }

    const handleChangePassword = async () => {
        if (!passwordsMatch) {
            Alert.alert("Password Change Failed", "New passwords do not match.");
            return;
        }
        const response = await apiCall('users/me/password', { currentPassword: currentPassword.trim(), newPassword: newPassword.trim() }, { "Authorization": `Bearer ${token}` }, 'PATCH');
        if (response?.success) {
            Alert.alert("Password Changed", "Your password was changed successfully.");
            wipeModal();
        } else Alert.alert("Password Change Failed", response?.error || "Failed to change password. Please try again.");
    };

    useEffect(() => {
        setPasswordsMatch(newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);

    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={wipeModal} >
            <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Change Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Current Password"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="New Password"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm New Password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                    {!passwordsMatch && <Text style={[styles.status, styles.invalid]}>Confirm Password Doesn't Match</Text>}
                    <TouchableOpacity onPress={handleChangePassword} style={styles.button}><Text style={styles.buttonText}>Change Password</Text></TouchableOpacity>
                    <TouchableOpacity onPress={wipeModal} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Cancel</Text></TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
};

export default PasswordModal;