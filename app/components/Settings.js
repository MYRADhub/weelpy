import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, Button, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Geolocation from 'react-native-geolocation-service';
// import pb from "../pocketbase";
import firebaseApp from "../firebase";
import { getDatabase, child, ref, get, set } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";

const db = getDatabase();
const dbRef = ref(db);
const authent = getAuth(firebaseApp);

const { width, height } = Dimensions.get('window');


export default function Settings() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [clicked, setClicked] = useState(false);
  const [auth, setAuth] = useState(null);
  const navigation = useNavigation();
  const isFocusedUsername = useRef(null);
  const isFocusedName = useRef(null);

  const verticalMargin = height * 0.5; // 50% of the screen height
  const horizontalMargin = width * 0.6; // 50% of the screen width
  const horizontalMargin1 = width * 0.69; // 50% of the screen width

  useEffect(() => {
    const authentData = async () => {
      // const authData = await pb.collection("users").authRefresh();
      const authData = await authent.currentUser;
      if (authData) {
        get(child(dbRef, `users/${authData.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setName(userData.name);
            setUsername(userData.username);
            setEmail(authData.email);
            setAuth(authData);
            // alert(JSON.stringify(userData));
          } else {
            alert("No data available");
          }
        }).catch((error) => {
          alert(error);
        });
      }
    };
    authentData().then((r) => {});
  }, []);

  const handleSubmit = async () => {
    setClicked(true);
    try {
      const data = {
        name,
        username,
      };
      // const record = await pb.collection("users").update(auth.record.id, data);
      // const record = await set(child(dbRef, `users/${auth.uid}`), data);

      set(child(dbRef, `users/${auth.uid}`), data).then(() => {
        alert("Done!");
        setName(data.name);
        setUsername(data.username);
        isFocusedName.current.blur();
        isFocusedUsername.current.blur();
      }).catch((error) => {
        alert(error);
      });
    } catch (e) {
      alert(`Something is wrong. Try again`);
    }
    setClicked(false);
  };

  const handleLogout = async () => {
    signOut(authent).then(() => {
      alert("You have been logged out");
      navigation.navigate("Home");
    }).catch((error) => {
      alert(error);
    });
  };

  return (
    <View>
      <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold", marginTop: '3%' }}>
        Settings (Your email: {email})
      </Text>
      <View style={{ marginTop: "5%" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Your name: </Text>
          <TextInput
            required
            id="name"
            name="name"
            placeholder="Your Name"
            value={name}
            ref={isFocusedName}
            onChangeText={(text) => setName(text)}
            style={{ borderColor: 'gray', // Border color
            borderWidth: 1,      // Border width
            borderRadius: 8,    // Border radius to create rounded corners
            paddingLeft: 10,    // Padding for text inside the input
            width: horizontalMargin1,
            // paddingRight: 100,   // Padding for text inside the input
           }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>Your username: </Text>
          <TextInput
            id="username"
            required
            name="username"
            placeholder="Username"
            value={username}
            ref={isFocusedUsername}
            onChangeText={(text) => setUsername(text)}
            style={{ borderColor: 'gray', // Border color
            borderWidth: 1,      // Border width
            borderRadius: 8,    // Border radius to create rounded corners
            paddingLeft: 10,    // Padding for text inside the input
            width: horizontalMargin,
            }}
          />
        </View>
        <View style={{ marginTop: verticalMargin }}>
        <Button
          title="Update Information"
          onPress={handleSubmit}
          disabled={clicked}
          color={'green'}
        />
        </View>
      </View>
      <View style={{ top: 20 }}>
        <Button
          title="Log Out"
          onPress={handleLogout}
          color={'orange'}
        />
      </View>
    </View>
  );
}
