import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import pb from '../pocketbase';
import firebaseApp from '../firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(firebaseApp);

export default function SignInScreen() {
  const [clicked, setClicked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    try {
      setClicked(true);
      if (password.length < 8) {
        alert('Minimum password length is 8');
        setClicked(false);
      } else {
        // await pb.collection('users').authWithPassword(email, password);
        signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // alert(JSON.stringify(user))
          alert('Signed in successfully')
          setClicked(false);
          navigation.navigate('Content'); // Navigate to the home screen after successful sign-in
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage)
          setClicked(false);
        });
      }
    } catch (e) {
      setClicked(false);
      alert(e.message);
      navigation.navigate('Content'); // Navigate to the home screen after successful sign-in
    }
  };
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Sign in</Text>
      <TextInput
        style={{
          width: '80%',
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginVertical: 10,
        }}
        placeholder="Email Address or Username"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={{
          width: '80%',
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          marginVertical: 10,
        }}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button
        title="Sign In"
        onPress={handleSubmit}
        disabled={clicked}
        color={'green'}
      />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={{ marginVertical: 10 }}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}
