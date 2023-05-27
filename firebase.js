import {initializeApp} from 'firebase/app';
import {getAuth, signInWithPopup, GoogleAuthProvider,FacebookAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import { getDatabase, ref, onValue } from "firebase/database";
import {getStorage} from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHm9yd_jMym8h1Qsckta0toGnZjBtvcNo",
  authDomain: "cschat1-1daa9.firebaseapp.com",
  databaseURL: "https://cschat1-1daa9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cschat1-1daa9",
  storageBucket: "cschat1-1daa9.appspot.com",
  messagingSenderId: "889391554824",
  appId: "1:889391554824:web:f636680b027e7673fd0cbd"
};
  

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();
const providerFacebook = new FacebookAuthProvider();

export const storageService = getStorage(app);
export const loginGoogle=()=>{
    return signInWithPopup(auth, provider)
}
export const loginFacebook=()=>{
  return signInWithPopup(auth, providerFacebook)
}
export const signupEmail = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

export const loginEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  
export { app, auth, database };