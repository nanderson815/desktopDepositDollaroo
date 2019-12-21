import React from 'react';
import './index.css';
import App from './Containers/App';
import * as serviceWorker from './serviceWorker';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { createStore, combineReducers } from 'redux'
import { ReactReduxFirebaseProvider, firebaseReducer } from 'react-redux-firebase'
import { createFirestoreInstance, firestoreReducer } from 'redux-firestore'

const fbConfig = {
    apiKey: "AIzaSyAosrAZT4ke1I6nG8DH3rgRlT9s5GoEMws",
    authDomain: "dolaroo.firebaseapp.com",
    databaseURL: "https://dolaroo.firebaseio.com",
    projectId: "dolaroo",
    storageBucket: "dolaroo.appspot.com",
    messagingSenderId: "485186240495",
    appId: "1:485186240495:web:86c42b042f9c6edc87c01a"
}

// react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
    enableClaims: true // Get custom claims along with the profile
}

// Initialize firebase instance
firebase.initializeApp(fbConfig)

// Initialize other services on firebase instance
firebase.firestore() // <- needed if using firestore

// Add firebase to reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer // <- needed if using firestore
})

// Create store with reducers and initial state
const initialState = {}
const store = createStore(rootReducer, initialState)

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance // <- needed if using firestore
}

// Setup react-redux so that connect HOC can be used
function FirebaseApp() {
    return (
        <Provider store={store}>
            <ReactReduxFirebaseProvider {...rrfProps}>
                <App />
            </ReactReduxFirebaseProvider>
        </Provider>
    );
}

render(<FirebaseApp />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
