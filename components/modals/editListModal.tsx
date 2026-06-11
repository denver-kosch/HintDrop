import { useModalStyles } from '@/styles';
import { EditListModalProps } from '@/types';
import { FC } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

const EditListModal:FC<EditListModalProps> = ({ visible, onClose, fetchList }) => {
    const styles = useModalStyles();

    const submitChanges = () => {
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalBackdrop}>
                <View style={styles.modalContent}>
                    <Text>blah</Text>

                    <TouchableOpacity onPress={submitChanges}>
                        <Text>Submit Changes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
};

export default EditListModal;