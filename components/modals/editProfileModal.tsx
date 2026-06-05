import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useEffect, useState } from "react";
import apiCall from "@/services/apiCall";
import { useModalStyles } from "@/styles";
import { EditProfileModalProps } from "@/types";
import UsernameStatusIndicator from "@/components/UsernameStatusIndicator";
import useUsernameAvailability from "@/hooks/useUsernameAvailablity";



const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, token, profile, fetchProfile }) => {
    const [first_name, setFirst_name] = useState(profile?.first_name || '');
    const [last_name, setLast_name] = useState(profile?.last_name || '');
    const [phone_num, setPhone_num] = useState(profile?.phone_num || '');
    const [username, setUsername] = useState(profile?.username || '');
    const {usernameStatus, isUsernameValid} = useUsernameAvailability({username, currentUsername: profile?.username});
    
    const styles = useModalStyles();

    const handleSave = async () => {
        if (!isUsernameValid) {
            Alert.alert("Invalid Username", "Please choose an available username.");
            return;
        }
        await apiCall('users/me', { body: { first_name, last_name, phone_num, username }, method: 'PATCH' })
            .then(() => {
                fetchProfile();
                onClose();
            })
            .catch(err => {
                console.error("Failed to update profile:", err);
                alert(err.message || "An error occurred while updating your profile.");
            });
    };

    const wipeModal = () => {
        setFirst_name(profile?.first_name || '');
        setLast_name(profile?.last_name || '');
        setPhone_num(profile?.phone_num || '');
        setUsername(profile?.username || '');
        onClose();
    }

    return (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose} >
            <KeyboardAvoidingView style={styles.modalBackdrop} behavior={Platform.OS === "ios" ? "padding" : "height"} >
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Profile</Text>
                    
                    <Text style={styles.label}>First Name:</Text>
                    <TextInput placeholder="First Name" value={first_name} onChangeText={setFirst_name} style={styles.input} />
                    
                    <Text style={styles.label}>Last Name:</Text>
                    <TextInput placeholder="Last Name" value={last_name} onChangeText={setLast_name} style={styles.input} />
                    
                    <Text style={styles.label}>Phone Number:</Text>
                    <TextInput placeholder="Phone Number" value={phone_num} onChangeText={setPhone_num} style={styles.input} />
                    
                    <Text style={styles.label}>Username:</Text>
                    <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
                    <UsernameStatusIndicator status={usernameStatus} />
                    
                    <TouchableOpacity onPress={handleSave} style={styles.button}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={wipeModal} style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

export default EditProfileModal;