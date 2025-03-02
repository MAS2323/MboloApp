import { Stack } from 'expo-router';

export default function Layout(){
  return (
    <Stack screenOptions={{
        headerShown: false
    }}>
      <Stack.Screen name="LoginSceen"  />
      <Stack.Screen name="RegisterScreen"/>
      {/* <Stack.Screen name="index"/> */}
      {/* Otras rutas */}
    </Stack>
  );
};

