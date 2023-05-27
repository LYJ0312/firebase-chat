import Login from './Login';
import React,{ useState, useEffect } from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, database} from "../firebase"
import { useStore } from '../utils/appState';
import { serverTimestamp } from 'firebase/database';
import { getDatabase, ref, onValue, set } from "firebase/database";
import Repository from '../service/repository'
import "../styles/global.css"
export default function App({ Component, pageProps }) {
  const [init, setInit] = useState(false);
  const [user, loading] = useAuthState(auth);
  const [loggedIn, setIsLoggedIn] = useState(false);

  const repository = new Repository();
  
  useEffect(() => {
      if (user) {

          set(ref(database, 'users/' + user.uid), {
            email: user.email,
            lastSeen: serverTimestamp(),
            photoURL: user.photoURL ? user.photoURL : null,
            displayName:user.displayName? user.displayName : user.email,
            uid:user.uid,
          })
        }
  }, [user]);
  
  useEffect(()=>{
    auth.onAuthStateChanged(user=>{
      if(user){
        setIsLoggedIn(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, [])

  return <>
      
      {init ? <>
        {!user && Component?.auth ? <Login/> : <Component loggedIn={loggedIn} repository={repository} {...pageProps} />}
      </> : "초기화 중"}
    </>

  
}
