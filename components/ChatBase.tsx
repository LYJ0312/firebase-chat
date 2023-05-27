import { useRef, useEffect, useState, useReducer } from "react";
import { useCallback } from "react";
import { memo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth } from "../firebase";
import { database } from "../firebase";
import ChatInput from "./ChatInput";
import Message from "./Message";
import { useStore } from "../utils/appState";
import { ref, onValue, remove } from "firebase/database";
import {v4 as uuidv4} from 'uuid';

const ChatContainer = styled.div`
  position: relative;
  top: 0;
  width: 1618px;
  height: 90%;
  overflow-y: auto;
  padding-right: 15px; /* 오른쪽 스크롤 너비를 고려하여 패딩 추가 */

  &::-webkit-scrollbar {
    width: 20px; /* 스크롤 너비를 조정 */
  }

  &::-webkit-scrollbar-thumb {
    background-color: #a4a4a4;
    border-radius: 100px;
    background-clip: padding-box;
    border: 5px solid transparent;
  }

  &::-webkit-scrollbar-track {
    background-color: #404040;
  }
`;

const ChatBase = ({id, chatData, opUser}) => {
    const [curUser] = useAuthState(auth);
    const {roomId} = useStore();
    const [messages, setMessages] = useState<any>([])
    const keys = useRef(null);

    const chatRef = useRef(null);
    useEffect(()=>{
        const starCountRef = ref(database, 'messages/' + roomId);
        onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            keys.current = data&&Object.keys(data);
            setMessages(data&&Object.values(data));
        });
    }, [roomId])
    const deleteMessage = (id) =>{
        remove(ref(database, 'messages/'+roomId+"/"+id));
    }
    
    const focusMessage = () =>{
        chatRef?.current?.scrollIntoView({smooth:"true", block:"end"});
    }
    useEffect(() => {

        focusMessage();
    }, [roomId, messages])
    return <ChatContainer >
        <div ref={chatRef}>
        {!!messages&&<>
                {messages.reverse().map((msg, i)=>{
                    const {message, timestamp, user, userEmail, userImage, type} = msg;
                    return <Message
                    key={keys.current[i]}
                    deleteMessage={()=>{deleteMessage(keys.current[i])}}
                    message={message}
                    type={type}
                    timestamp={timestamp}
                    user={curUser}
                    userImage={userImage}
                    email={userEmail}
                    nickname={user}
                    />
                })}   
            </>}


        </div>

        </ChatContainer> 
}

export default memo(ChatBase);