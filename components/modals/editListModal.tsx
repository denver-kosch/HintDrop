import { useModalStyles } from '@/styles';
import { FC } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

type EditListModalProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  fetchList: () => void;
};

const EditListModal:FC<EditListModalProps> = ({ visible, setVisible, fetchList }) => {
    const styles = useModalStyles();

    const onClose = () => {
        setVisible(false);
    };

    const submitChanges = () => {
        
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
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