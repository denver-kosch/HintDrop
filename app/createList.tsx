import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useCreateListStyles } from '@/styles';
import apiCall from '@/services/apiCall';
import { useAppNavigation } from '@/hooks/appNav';

type NewListResponse = {
    success: boolean;
    listId: number
};

const CreateList = () => {
    const [name, setName] = useState('');
    const styles = useCreateListStyles();
    const [description, setDescription] = useState('');
    const navigation = useAppNavigation();

    const createList = async () => {
        const newList = await apiCall<NewListResponse>('lists', {body: { name, description }, method: 'POST' });
        if (newList.success) {
            setName('');
            setDescription('');
            navigation.replace('ListDetail', { id: newList.listId });
        }
    };
    
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Text style={styles.header}>Create List</Text>
                <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="List Name"
                    onChangeText={text => setName(text)}
                    value={name}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    onChangeText={text => setDescription(text)}
                    value={description}
                />
                <TouchableOpacity style={styles.button} onPress={createList}>
                    <Text style={styles.buttonText}>Create List</Text>
                </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
};

export default CreateList;
