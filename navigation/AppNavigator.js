import { NavigationContainer } from '@react-navigation/native';

import { useSelector } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';

export default function AppNavigator() {

  const user = useSelector(state => state.auth.user);

  return (

    <NavigationContainer>

      {
        user
          ? <DrawerNavigator />
          : <AuthNavigator />
      }

    </NavigationContainer>

  );

}