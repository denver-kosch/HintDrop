import { Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types';


export default function NotFoundScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Main")}>
          <Text style={styles.link}>Go to home screen!</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
