import { View, Text, Button } from 'react-native';

export default function Entrenamiento() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>EntrenamientoComponent</Text>
      <Button title="Iniciar entrenamiento" onPress={() => {}} />
    </View>
  );
}
