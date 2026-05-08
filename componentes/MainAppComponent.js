import { createDrawerNavigator } from '@react-navigation/drawer';

import Perfil from './PerfilComponent';
import Entrenamiento from './EntrenamientoComponent';
import MisEntrenamientos from './MisEntrenamientosComponent';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import { View, Text, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {

  return (

    <DrawerContentScrollView {...props}>

      <View style={styles.drawerHeader}>

        <MaterialCommunityIcons
          name="run"
          size={60}
          color="white"
        />

        <Text style={styles.drawerTitle}>
          MotionTrack
        </Text>

        <Text style={styles.drawerSubtitle}>
          Your fitness companion
        </Text>

      </View>

      <DrawerItemList {...props} />

    </DrawerContentScrollView>
  );
}

export default function MainApp() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (<CustomDrawerContent {...props} />)}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1565C0'
        },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#1565C0',
        drawerLabelStyle: {
          fontSize: 16
        },
        drawerStyle: {
          backgroundColor: '#f4f7fb'
        }
      }}
    >
      <Drawer.Screen
        name="Perfil"
        component={Perfil}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account"
              color={color}
              size={size}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Entrenamiento"
        component={Entrenamiento}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="run"
              color={color}
              size={size}
            />
          )
        }}
      />
      <Drawer.Screen
        name="Mis Entrenamientos"
        component={MisEntrenamientos}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="history"
              color={color}
              size={size}
            />
          )
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({

  drawerHeader: {
    backgroundColor: '#1565C0',
    paddingVertical: 40,
    alignItems: 'center',
    marginBottom: 10
  },

  drawerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10
  },

  drawerSubtitle: {
    color: 'white',
    opacity: 0.8,
    marginTop: 5
  }

});