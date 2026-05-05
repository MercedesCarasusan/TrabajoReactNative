import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function Login({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                console.log("Login correcto");
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    return (
        <View style={styles.container}>

            <Text style={{ fontSize: 22, textAlign: 'center', marginBottom: 20 }}>
                Login
            </Text>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />

            <TextInput
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <Button mode="contained" onPress={handleLogin}>
                Login
            </Button>

            <Button onPress={() => navigation.navigate('Register')}>
                Crear cuenta
            </Button>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { marginBottom: 10 }
});