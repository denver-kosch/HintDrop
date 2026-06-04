import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useEffect, useState } from "react";
import apiCall from "@/services/apiCall";
import { useModalStyles } from "@/styles";
import { EditProfileModalProps } from "@/types";



const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, token, profile, fetchProfile }) => {
    const [first_name, setFirst_name] = useState(profile?.first_name || '');
    const [last_name, setLast_name] = useState(profile?.last_name || '');
    const [phone_num, setPhone_num] = useState(profile?.phone_num || '');
    const [username, setUsername] = useState(profile?.username || '');
    const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
    
    const styles = useModalStyles();

    const handleSave = async () => {
        if (usernameStatus === "invalid" || usernameStatus === "taken") {
            alert("Please choose a valid and available username.");
            return;
        }
        const response = await apiCall('users/me', { first_name, last_name, phone_num, username }, { "Authorization": `Bearer ${token}` }, 'PATCH');
        if (!response?.success) console.error("Failed to update profile:", response?.message);
        fetchProfile();
        onClose();
    };

    const wipeModal = () => {
        setFirst_name(profile?.first_name || '');
        setLast_name(profile?.last_name || '');
        setPhone_num(profile?.phone_num || '');
        setUsername(profile?.username || '');
        setUsernameStatus("idle");
        onClose();
    }

    useEffect(() => {
        const cleanUsername = username.trim();

        if (!cleanUsername || cleanUsername === profile?.username) {
            setUsernameStatus("idle");
            return;
        }
        if (cleanUsername.length < 5) {
            setUsernameStatus("invalid");
            return;
        }

        const timeout = setTimeout(async () => {
            setUsernameStatus("checking");
            const res = await apiCall('users/check-username', { username: cleanUsername }, {}, 'GET');
            setUsernameStatus(res.available ? "available" : "taken");
        }, 400);

        return () => clearTimeout(timeout);
        }, [username]);

    const UsernameStatusIndicator = () => {
        switch (usernameStatus) {
            case "checking":
                return <Text style={styles.status}>Checking...</Text>;
            case "available":
                return <Text style={[styles.status, styles.available]}>Username is available</Text>;
            case "taken":
                return <Text style={[styles.status, styles.taken]}>Username is taken</Text>;
            case "invalid":
                return <Text style={[styles.status, styles.invalid]}>Invalid username</Text>;
            default:
                return null;
        }
    };

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
                    <UsernameStatusIndicator />
                    
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