import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';


const config = {
  apiKey: "AIzaSyCJsHJXQPx5K2dmSvLLPyvV1XrSBvB8dVQ",
  authDomain: "webproject-c5878.firebaseapp.com",
  databaseURL: "https://webproject-c5878-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "webproject-c5878",
  storageBucket: "webproject-c5878.appspot.com",
  messagingSenderId: "448524087667",
  appId: "1:448524087667:web:09d602a579731fcc2f5506",
  measurementId: "G-6JNYH4QH5K"
};

firebase.initializeApp(config);

export const FirebaseAuth = firebase.auth();

const firestore = firebase.firestore();

export const users = firestore.collection('users');
export const items = firestore.collection('products');
