import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
// import pb from "../pocketbase";
import firebaseApp from "../firebase";
import { getDatabase, child, ref, get, query } from "firebase/database";
import { getAuth } from "firebase/auth";
import PostDesign from "./OnePost";
import CreatePost from "./CreatePost";

const db = getDatabase(firebaseApp);
const dbRef = ref(getDatabase(firebaseApp));
const authent = getAuth(firebaseApp);

export default function Posts() {
  const [auth, setAuth] = useState(null);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // const authData = await pb.collection("users").authRefresh();
      const authData = await authent.currentUser;
      // alert(JSON.stringify(authData))
      if (authData) {
        get(child(dbRef, `users/${authData.uid}`)).then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            setAuth(userData);
          } else {
            alert("No data available");
          }
        }).catch((error) => {
          alert(error);
        });
      }
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
      // setRefreshing(false);
    };

    if (refreshing) {
      // alert("refreshing");
      fetchData();
    }

    fetchData();
  }, [refreshing]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            marginVertical: 10,
          }}
        >
          Welcome, {auth?.name}!
        </Text>
        {posts.map((i) => (
          <PostDesign
            key={i.id}
            userID={i.author}
            content={i.content}
            locationX={i.locationX}
            locationY={i.locationY}
            created={i.created}
            planned={i.planned}
          />
        ))}
      </ScrollView>
      <CreatePost />
    </View>
  );
}
