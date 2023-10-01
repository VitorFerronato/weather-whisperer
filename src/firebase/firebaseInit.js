import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBJnR6bE1U6d1M_TuDEzVvM4Dq2ud6ULa0",
    authDomain: "weather-whisperer.firebaseapp.com",
    projectId: "weather-whisperer",
    storageBucket: "weather-whisperer.appspot.com",
    messagingSenderId: "274493315136",
    appId: "1:274493315136:web:3538b504f931cf420627a5"
};

initializeApp(firebaseConfig)

const db = getFirestore()

export default db