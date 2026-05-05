import { View, Text, Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function MainApp() {

  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>ESTÁS DENTRO DE LA APP</Text>

      <Button title="Cerrar sesión" onPress={() => signOut(auth)} />
    </View>
  );
}