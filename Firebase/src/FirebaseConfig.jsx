// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEpObnXuslOW1CVVGW-fE0OjA8L7vuONE",
  authDomain: "fbproject-12.firebaseapp.com",
  projectId: "fbproject-12",
  storageBucket: "fbproject-12.appspot.com",
  messagingSenderId: "833321893396",
  appId: "1:833321893396:web:1e0770001a53f8972b3101"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);
export{auth,db,storage};
