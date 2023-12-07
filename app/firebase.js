// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNdSCjw5-PQbnUHLCmj7W2aJ_Ncdf4xFI",
  authDomain: "word-cards-c564b.firebaseapp.com",
  databaseURL: "https://word-cards-c564b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "word-cards-c564b",
  storageBucket: "word-cards-c564b.appspot.com",
  messagingSenderId: "1010686458159",
  appId: "1:1010686458159:web:cc091f8b986cebd77ac9da",
  measurementId: "G-QBFTRR88X6"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

export default firebaseApp;