import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import 'expo-dev-client';

import Login from './componentes/LoginComponent';
import Register from './componentes/RegisterComponent';
import MainApp from './componentes/MainAppComponent';

import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

const Stack = createNativeStackNavigator();

export default function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <View style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>

              {user ? (
                <Stack.Screen name="MainApp" component={MainApp} />
              ) : (
                <>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Register" component={Register} />
                </>
              )}

            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}