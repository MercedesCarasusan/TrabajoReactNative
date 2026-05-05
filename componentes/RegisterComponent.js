import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function Register({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigation.navigate('Login');
            })
            .catch(error => {
                console.log(error.message);
            });
    };

    return (
        <View style={styles.container}>

            <Text style={{ fontSize: 22, textAlign: 'center', marginBottom: 20 }}>
                Registro
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

            <Button mode="contained" onPress={handleRegister}>
                Registrarse
            </Button>

            <Button onPress={() => navigation.navigate('Login')}>
                Ya tengo cuenta
            </Button>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { marginBottom: 10 }
});