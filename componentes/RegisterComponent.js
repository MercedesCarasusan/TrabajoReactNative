import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Register({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = () => {

        setErrorMessage('');

        createUserWithEmailAndPassword(auth, email, password)

            .then(() => {

                navigation.navigate('Login');

            })

            .catch(error => {

                let message = 'Ha ocurrido un error';

                switch (error.code) {

                    case 'auth/email-already-in-use':
                        message = 'Ese email ya está registrado';
                        break;

                    case 'auth/invalid-email':
                        message = 'El email no es válido';
                        break;

                    case 'auth/weak-password':
                        message = 'La contraseña debe tener al menos 6 caracteres';
                        break;

                    default:
                        message = 'No se pudo crear la cuenta';
                }

                setErrorMessage(message);
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

            {
                errorMessage !== '' && (

                    <View style={styles.errorBox}>

                        <MaterialCommunityIcons
                            name="alert-circle"
                            size={20}
                            color="#D32F2F"
                        />

                        <Text style={styles.errorText}>
                            {errorMessage}
                        </Text>

                    </View>
                )
            }

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
    input: { marginBottom: 10 },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15
    },
    errorText: {
        color: '#D32F2F',
        marginLeft: 8,
        fontWeight: '500'
    }
});