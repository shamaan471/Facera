// import * as firebase from 'firebase';
import * as firebase from "firebase/app";

import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyDLNKHaqVg-cCkmOE8JZ8tiXLKoLSmGWJw',
    authDomain: '1058717224915-sg12nt4np9p5mj49vc477sj4vu0ka04c.apps.googleusercontent.com',//
    databaseURL: 'https://facera-v2-default-rtdb.europe-west1.firebasedatabase.app/',
    projectId: 'facera-v2',
    storageBucket: 'facera-v2.appspot.com',
    //messagingSenderId: '12345-insert-yourse', //
    appId: '1:1058717224915:android:777399c9b48070e491e926',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };