import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
// import pb from '../pocketbase';
import firebaseApp from '../firebase';
import { getDatabase, child, ref, get } from 'firebase/database';
import MapView, { Marker } from 'react-native-maps';
import Popup from './Popup';

const db = getDatabase(firebaseApp);
const dbRef = ref(getDatabase(firebaseApp));

export default function OnePost({ userID, planned, content, locationX, locationY, created }) {
  const [name, setName] = useState('Loading...');
  const [username, setUsername] = useState('Loading...');
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleMarkerPress = (post) => {
    post.author = post.userID
    setSelectedMarker(post);
    setShowPopup(true);
  };

  useEffect(() => {
    const auth = async () => {
      // const resultList = await pb.collection("users").getOne(userID);
      get(child(dbRef, `users/${userID}`)).then((snapshot) => {
        if (snapshot.exists()) {
          // alert(JSON.stringify(snapshot.val()));
          const userData = snapshot.val();
          // alert(JSON.stringify(userData));
          setName(userData.name);
          setUsername(userData.username);
        } else {
          alert('No data available');
        }
      }).catch((error) => {
        alert(error);
      });
    };
    auth().then((r) => {});
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarBack}>
          <Text style={styles.avatar}>{name.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.headerText}>{`${name} (@${username})`}</Text>
        {/* show date planned as an absolute date without time*/}
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.subheaderText}>Planned for {moment(planned).format('MMMM Do YYYY')}</Text>
          <Text style={styles.subheaderText}>Posted {moment(created).fromNow()}</Text>
        </View>
      </View>
      {(locationX && locationY) ? (
        <>
          <View style={{ borderStyle: 'dotted', borderWidth: 0.8, borderColor: 'black' }}>
            <MapView
              style={{ height: 200, width: 400 }}
              initialRegion={{
                latitude: locationX,
                longitude: locationY,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker coordinate={{ latitude: locationX, longitude: locationY }} />
            </MapView>
          </View>
          <View style={styles.contentContainer}>
            {/* {content.split('\n').map((x, index) => (
              <Text numberOfLines={1} ellipsizeMode='tail' key={index} style={styles.paragraph}>
                {x} lmfao
              </Text>
            ))} */}
            <TouchableOpacity onPress={() => handleMarkerPress({ locationX, locationY, content, planned, userID })}>
              <Text numberOfLines={2} ellipsizeMode='tail' style={styles.paragraph} >{content}</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.contentContainer}>
          {/* {content.split('\n').map((x, index) => (
            <Text key={index} style={styles.paragraph}>
              {x}
            </Text>
          ))} */}
          <Text numberOfLines={3} ellipsizeMode='tail' style={styles.paragraph} >{content}</Text>
          <Text>Location: {locationX}, {locationY} </Text>
        </View>
      )}
      <Popup
        visible={showPopup}
        marker={selectedMarker}
        onClose={() => setShowPopup(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 2,
    borderStyle: 'solid', 
    borderWidth: 1, 
    borderColor: 'gray',
    borderRadius: 5,
    // elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBack: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: 'gray', // Customize the avatar background color
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    top: 3,
    right: 2,
    // borderRadius: 20,
    // backgroundColor: 'green', // Customize the avatar background color
    color: 'white', // Customize the avatar text color
    fontSize: 20,
    textAlign: 'center',
    // marginRight: 20,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subheaderText: {
    fontSize: 12,
    color: 'gray', // Customize the subheader text color
  },
  mapContainer: {
    height: 200, // Customize the map container height
  },
  map: {
    flex: 1,
    width: 200, // Customize the map width
  },
  contentContainer: {
    marginTop: 10,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 10,
  },
});
