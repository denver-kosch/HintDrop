import { ScrollView, Text, View } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHomeStyles } from "@/styles"
import { store } from "@/store";
import apiCall from "@/services/apiCall";

export default function Index() {
  const token = store.getState().auth.token;
  const styles = useHomeStyles();
  const [name, setName] = useState<String>("");



  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => apiCall('getUser', {fields: ['first_name']}, { Authorization: `Bearer ${token}` }).then(user => { if (user.success) setName(user.userData.first_name)});
      if (token) fetchUser();
    }, [token])
  );


  const notLoggedInScreen = () => {
    // In Progress
  };




  const IndexContents = () => {
    return ( 
      <View style={{ width: '100%' }}>
    	  <Text style={styles.header}>Welcome{(name) ? `, ${name}` : ""}!</Text>

      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <IndexContents/>
      </ScrollView>
    </SafeAreaView>
  );
}
