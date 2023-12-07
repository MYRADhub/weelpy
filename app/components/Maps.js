import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import Popup from './Popup';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import Typography from '@mui/material/Typography';
// import pb from '../pocketbase';
import firebaseApp from "../firebase";
import { getDatabase, child, ref, get, query } from "firebase/database";
import { getAuth } from "firebase/auth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const db = getDatabase(firebaseApp);
const dbRef = ref(getDatabase(firebaseApp));
const authent = getAuth(firebaseApp);

const CustomMarker = () => (
  <Image
    source={require('../../assets/location-warning-final.png')} // Specify the path to your custom marker image
    style={{ width: 40, height: 40 }} // Adjust the width and height as needed
  />
);

export default function Maps() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const handleRefreshPress = async () => {
    try {
      await schedulePushNotification(); // Call the async function
      handleRefreshMap();        // Call the synchronous function
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleRefreshMap = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleMarkerPress = (post) => {
    setSelectedMarker(post);
    setShowPopup(true);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // const records = await pb.collection('posts').getFullList(200 /* batch size */, {
          // sort: '-created',
        // });

        const records = [];

        const recordsRef = query(ref(db, "posts"));
        const snapshot = await get(recordsRef);
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            // alert(JSON.stringify(childData));
            records.push({ id: childKey, ...childData });
          });
        } else {
          alert("No data available");
        }

        // alert(JSON.stringify(records));
        // records.splice(1, 1);
        setPosts(records);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    if (refreshing) {
      fetchPosts();
    }

    fetchPosts();

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [refreshing]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Here you can see all locations of recent posts</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.45, // Your initial latitude
          longitude: 49.84, // Your initial longitude
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {posts.map((post) => {
          const { locationX, locationY } = post;
          if ( locationX && locationY) {
            return (
              <Marker
                key={post.id}
                coordinate={{ latitude: locationX, longitude: locationY }}
                onPress={() => handleMarkerPress(post)}
                />
                );
              }
          return null;
        })}
        <Marker
        coordinate={{ latitude: 40.3, longitude: 49.8 }}
        title="Marker Title"
        description="Marker Description">
        <CustomMarker />
        </Marker>
      <Circle
        center={{ latitude: 40.3, longitude: 49.8 }}
        radius={3000} // Set the radius in meters
        fillColor="rgba(255, 128, 0, 0.2)" // Circle fill color
        strokeColor="rgba(255, 128, 0, 0.7)" // Circle border color
      />
      </MapView>
      <Popup
        visible={showPopup}
        marker={selectedMarker}
        onClose={() => setShowPopup(false)}
      />
      <View style={{ position: 'absolute', top: 50, right: 20 }}>
        <TouchableOpacity onPress={handleRefreshPress}>
          <Icon name="refresh" size={30} color="green" />
        </TouchableOpacity>
      </View>
      {/* <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You are in a dangerous zone",
      body: 'You are in a zone with a high risk of an earthquake. Be careful!',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}