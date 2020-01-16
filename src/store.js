import { createStore, combineReducers, compose }  from 'redux';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firebase from 'firebase/app';

import 'firebase/firestore';
import 'firebase/auth';

//cfg firestore
const firebaseConfig = {
    apiKey: "AIzaSyCZBZackWwOhcr0QcQpz7aK6B_q_pp7HGo",
    authDomain: "bibliostore-6ab66.firebaseapp.com",
    databaseURL: "https://bibliostore-6ab66.firebaseio.com",
    projectId: "bibliostore-6ab66",
    storageBucket: "bibliostore-6ab66.appspot.com",
    messagingSenderId: "203978369752",
    appId: "1:203978369752:web:a7f7b295cd3e16b90905ad",
    measurementId: "G-W6GQFD92GK"
  };

firebase.initializeApp(firebaseConfig);

//cfg react-redux
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
}

//crear el enhancer con compose de redux y firestore
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, rrfConfig),
    reduxFirestore(firebase)
)(createStore);

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer
})

const initialState = {};

const store = createStoreWithFirebase(rootReducer, initialState, compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))

export default store;