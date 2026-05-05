import { createDrawerNavigator } from '@react-navigation/drawer';

import Perfil from './PerfilComponent';
import Entrenamiento from './EntrenamientoComponent';

const Drawer = createDrawerNavigator();

export default function MainApp() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Perfil" component={Perfil} />
      <Drawer.Screen name="Entrenamiento" component={Entrenamiento} />
    </Drawer.Navigator>
  );
}