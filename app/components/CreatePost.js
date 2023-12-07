import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
// import pb from '../pocketbase';
import firebaseApp from '../firebase';
import { getDatabase, push, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";

import MapView  from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';

const stringToGeoLoc = (x) => {
  const y = x.split(',').map(Number);
  return y.length === 2 && y.every((x) => !isNaN(x)) ? { x: y[0], y: y[1] } : { x: 0, y: 0 };
};

const checkLoc = (x) => {
  const y = x.split(',').map(Number);
  return y.length === 2 && y.every((x) => !isNaN(x));
};

const db = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

export default function CreatePost() {
  const [open, setOpen] = useState(false);
  const [locErr, setLocErr] = useState(false);
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [postLoc, setPostLoc] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setSelectedDate(selectedDate);
  };

  const handleSubmit = async () => {
    // if the location is not in the correct format, do not submit
    if (locErr) {
      alert('Location is not in the correct format')
      return;
    }
    // if no content, do not submit
    if (!content) {
      alert('Content is empty')
      return;
    }
    // if no location, do not submit
    if (!location) {
      alert('Location is empty')
      return;
    }

    // const authData = await pb.collection('users').authRefresh();
    const userID = auth.currentUser.uid;
    // get the username from the database using the userID users/{userID}/username
    // const username = (await get(ref(db, `users/${userID}/username`))).val();
    let data = {
      content,
      author: userID,
      locationX: 0,
      locationY: 0,
      created: Date.now(),
      planned: selectedDate.getTime(),
    };
    if (location && postLoc) {
      // data.location = JSON.stringify({ x: postLoc.x, y: postLoc.y });
      data.locationX = postLoc.x;
      data.locationY = postLoc.y;
    }
    // data.content = data.content.replace(/\n/g, '<br />');
    // await pb.collection('posts').create(data);
    const newPostKey = push(ref(db, 'posts')).key;
    set(ref(db, `posts/${newPostKey}`), data);

    // clear the input fields
    setContent('');
    setLocation('');
    setPostLoc(null);
    setLocErr(false);
    setSelectedDate(new Date());
    setShowDatePicker(false);

    handleClose();
    location.reload();
  };

  return (
    <View>

      <TouchableOpacity
        onPress={handleClickOpen}
        style={styles.fab}
      >
        <Icon name="plus" size={20} color="white" />
        {/* <Text style={styles.fabText}>+</Text> */}
        {/* <Text style={styles.fabText}>LMFASOKOWQKOEKQWEQWQEQ</Text> */}
      </TouchableOpacity>

      <Modal
        isVisible={open}
        onBackdropPress={handleClose}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
      >
        <ScrollView>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: 'row' }}>
            <Text style={styles.modalHeader}>New Post</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              multiline
              placeholder="Write here..."
              value={content}
              onChangeText={(text) => setContent(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Date"
              value={selectedDate.toDateString()}
              onFocus={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />)}
            <TextInput
              style={styles.input}
              placeholder="Sample: 40.43, 49.83"
              value={location}
              onChangeText={(text) => {
                setLocation(text);
                setPostLoc(stringToGeoLoc(text));
                setLocErr(!checkLoc(text) && text !== '');
              }}
            />
            {locErr && (
              <Text style={styles.errorText}>
                Location should be in the format: latitude, longitude
              </Text>
            )}
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 40.45,
                longitude: 49.84,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {postLoc && (
                <Marker
                  coordinate={{ latitude: postLoc.x, longitude: postLoc.y }}
                />
              )}
            </MapView>
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>Create</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    width: 30,
    height: 30,
    marginLeft: 260,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
    borderRadius: 20, // Make it a circle
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    backgroundColor: 'green',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 24,
    // color: 'blue',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  map: {
    height: 200,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
