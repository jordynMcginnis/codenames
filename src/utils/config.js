import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAGAW16Y4f6eUnmNGJz7_F323mKYmeFjaY",
  authDomain: "codenames-2.firebaseapp.com",
  databaseURL: "https://codenames-2.firebaseio.com",
  projectId: "codenames-2",
  storageBucket: "codenames-2.appspot.com",
  messagingSenderId: "361289670414"
};

firebase.initializeApp(config);
export const firebasedb = firebase.database();