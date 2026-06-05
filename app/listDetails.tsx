import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useListDetailStyles } from '@/styles';


const ListDetailsPage = () => {
    const styles = useListDetailStyles();

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.container}>
                <Text style={styles.header}>List Detail</Text>
            </View>
        </SafeAreaView>
    )
};

export default ListDetailsPage;
