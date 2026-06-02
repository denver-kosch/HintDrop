import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import apiCall from "@/services/apiCall";
import { useModalStyles } from "@/styles";

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    token: string;
    profile?: {
        first_name: string;
        last_name: string;
        phone_num: string;
        username: string;
    };
    fetchProfile: () => void;
}


const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, token, profile, fetchProfile }) => {
    const [first_name, setFirst_name] = useState(profile?.first_name || '');
    const [last_name, setLast_name] = useState(profile?.last_name || '');
    const [phone_num, setPhone_num] = useState(profile?.phone_num || '');
    const [username, setUsername] = useState(profile?.username || '');
    
    const styles = useModalStyles();

    const handleSave = async () => {
        const response = await apiCall('updateUser', { first_name, last_name, phone_num, username }, { "Authorization": `Bearer ${token}` });
        if (!response?.success) console.error("Failed to update profile:", response?.message);
        fetchProfile();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TextInput placeholder="First Name" value={first_name} onChangeText={setFirst_name} style={styles.input} />
                <TextInput placeholder="Last Name" value={last_name} onChangeText={setLast_name} style={styles.input} />
                <TextInput placeholder="Phone Number" value={phone_num} onChangeText={setPhone_num} style={styles.input} />
                <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
                <TouchableOpacity onPress={handleSave} style={styles.button}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

export default EditProfileModal;