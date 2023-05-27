import styled from "styled-components";
import {auth, database} from "../firebase.js"
import {Avatar, Button} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useMemo, useState, useRef, useCallback, useReducer } from "react";
import { useStore } from "../utils/appState";
import EmailValidator from "email-validator";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import Chat from "../components/Chat";
import { useParams } from "react-router-dom";

import { getDatabase, ref, onValue} from "firebase/database";
import React from "react";
//@ts-ignore
import Sidebar from "../components/Sidebar.tsx";
const Container = styled.div`
  position:relative;
  width:100vw;
  height:100vh;
  background-color:black;
`
const Layout = styled.div`
  position:relative;
  width:100%;
  height:100%;
  display:flex;
`
function Project() {   
    const { setRoomId, roomId } = useStore(); 


    //states
    const [user] = useAuthState(auth);
    
    const [detail, setDetail] = useState(null);


    // ref
    const roomData = useRef(null);

    // firebase data
    const userChatRef = ref(database, 'userRooms/' + user!.uid);


    //const [a] = useDocument(db.collection("users").doc(user.uid))

    const [, forceUpdate] = useReducer(num => num + 1, 0); //강제 리렌더링

    // useEffect

  
    
    
    // useMemo(() => {
        
    //     const a = db.collection('projects').doc(String(pjid))
    //     a.get().then(res=>{
    //         if(!res.exists) router.push("/404") // 해당 프로젝트 없으면 오류 페이지로 리디렉션
    //         setDetail(res.data())
    //         roomData.current = [a, res];
            
    //     })

    // }, [roomId]);

    // const chatAlreadyExists = (recipientEmail) => (
    //     !!chatsSnapshot?.docs.find(
    //         (chat) =>
    //             chat.data().users.find((user) => user === recipientEmail)?.length > 0
    //     )
    // )
    const addDm = () => {
        const targetEmail = prompt("DM할 이메일을 써주세요");
        if (!targetEmail) return null;
        // if (EmailValidator.validate(targetEmail) && !chatAlreadyExists(targetEmail) && targetEmail !== user.email) {
            
        //     const ac = usersData.docs.filter(doc => doc.data().email == targetEmail)
        //     ab.doc(String(pjid)).collection("chats").add({
        //         users: [user.email, targetEmail],
        //         userImages: [user.photoURL, ac[0].data().photoURL],
        //         userNicknames: [user?.email, ac[0].data().email ]
        //     })
        // }
    }
    return (
      <>
      <Container>
      <Layout>
       <Sidebar id={roomId}/>
       <Chat id={roomId.toString()}/>
      </Layout>
      </Container>
      </>
        



    )
}

export default Project;


Project.auth = true;

