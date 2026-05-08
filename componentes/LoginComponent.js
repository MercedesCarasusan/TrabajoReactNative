import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = () => {

        setErrorMessage('');

        signInWithEmailAndPassword(auth, email, password)

            .then(() => {

                console.log("Login correcto");

            })

            .catch(error => {

                let message = 'Ha ocurrido un error';

                switch (error.code) {

                    case 'auth/invalid-credential':
                        message = 'Email o contraseña incorrectos';
                        break;

                    case 'auth/invalid-email':
                        message = 'El email no es válido';
                        break;

                    case 'auth/user-disabled':
                        message = 'Esta cuenta ha sido deshabilitada';
                        break;

                    case 'auth/too-many-requests':
                        message = 'Demasiados intentos. Inténtalo más tarde';
                        break;

                    default:
                        message = 'No se pudo iniciar sesión';
                }

                setErrorMessage(message);
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