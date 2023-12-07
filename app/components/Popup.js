import React, {useEffect, useState} from 'react';
import { Modal, View, Text, Button, Dimensions } from 'react-native';
import moment from 'moment';
import firebaseApp from '../firebase';
import { getDatabase, child, ref, get } from 'firebase/database';
import MapView, { Marker } from 'react-native-maps';

const db = getDatabase(firebaseApp);
const dbRef = ref(getDatabase(firebaseApp));

const Popup = ({ visible, marker, onClose }) => {
  if (!visible) return null;
  const [name, setName] = useState('Loading...');
  const [username, setUsername] = useState('Loading...');

  useEffect(() => {
    const auth = async () => {
      // alert(JSON.stringify(marker));
      // const resultList = await pb.collection("users").getOne(userID);
      // alert(JSON.stringify(marker));
      get(child(dbRef, `users/${marker.author}`)).then((snapshot) => {
        if (snapshot.exists()) {
          // alert(JSON.stringify(snapshot.val()));
          const userData = snapshot.val();
          // alert(JSON.stringify(userData));
          setName(userData.name);
          setUsername(userData.username);
        } else {
          // alert('No data available');
        }
      }).catch((error) => {
        alert(error);
      });
    };
    auth().then((r) => {});
  }, []);

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{ marginTop: 10}}>
        <Text style={{ fontWeight: 'bold', color: 'green' }}>Marker Information:</Text>
        <Text>Author: {`${name} (@${username})`} </Text>
        <Text>Description: {marker.content} </Text>
        <Text>Date planned: {moment(marker.planned).format('MMMM Do YYYY')} </Text>
        <MapView
          style={{ width: '100%', height: '80%' }}
          region={{
            latitude: marker.locationX,
            longitude: marker.locationY,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude: marker.locationX, longitude: marker.locationY }}></Marker>
        </MapView>
        <Button title="Close" onPress={onClose} color={'green'} />
      </View>
    </Modal>
  );
};

export default Popup;
