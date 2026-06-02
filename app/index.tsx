import { ScrollView, Text, View, } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHomeStyles } from "@/styles"
import { store } from "@/store";
import apiCall from "@/services/apiCall";

export default function Index() {
  const insets = useSafeAreaInsets();
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
    // <SafeAreaProvider>
    //   <SafeAreaView style={styles.container}>
        <ScrollView style={{ width: '100%' }}>
          <IndexContents/>
        </ScrollView>
    //   </SafeAreaView>
    // </SafeAreaProvider>
  );
}