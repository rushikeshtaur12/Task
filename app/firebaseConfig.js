import { initializeApp } from "firebase/app";
import {getFirestore }  from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyBtBwLTYgD_iiQnbs1acC3sC33fcjudYx0",
  authDomain: "demotest-5851f.firebaseapp.com",
  projectId: "demotest-5851f",
  storageBucket: "demotest-5851f.appspot.com",
  messagingSenderId: "520868264693",
  appId: "1:520868264693:web:97eef118e1bd0be8eda3bc",
  measurementId: "G-YXTDEXDDVS"
};
const app = initializeApp(firebaseConfig);
const  db=getFirestore(app)
export {db}