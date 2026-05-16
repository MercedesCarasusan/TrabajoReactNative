import 'expo-dev-client';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { setUser } from './redux/slices/authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';



function AppContent() {

  const dispatch = useDispatch();

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setUser(
        user
          ? {
              uid: user.uid,
              email: user.email
            }
          : null
      ));
    });

    return unsubscribe;

  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}


// ======================
// APP
// ======================

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );

}