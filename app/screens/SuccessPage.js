import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SuccessScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>
        <Text style={{ fontSize: 36, color: 'green' }}>✔</Text> Well done!
      </Text>
      <Text style={{ fontSize: 18, marginVertical: 20, textAlign: 'center' }}>
        You can log in to our system :)
      </Text>
      <Button title="Login" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
}
