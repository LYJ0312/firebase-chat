import { InfoOutlined, InputSharp, Star, StarBorderOutlined } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, database } from "../firebase";
import { useStore } from "../utils/appState";
import ChatBase from "./ChatBase";
import { get, child, ref } from "firebase/database";
import ChatInput from "./ChatInput";
import Image from "next/image";
function Chat({ id }: { id: string }) {
     
    //channels
    
    const router = useRouter();
    const [user] = useAuthState(auth);
    // const [userData] = useDocument(db.collection("users").doc(user.uid));
    // const curProj = db.collection('projects').doc(pjid);
    const [init, setInit] = useState(true);
    const [cData, setCData] = useState(null);
    

    const dbRef = ref(database);
    const [opNick, setOpNick] = useState<string>("Loading...");
    const [opUser, setOpUser] = useState<any>(null);
    const [chatData, setChatData] = useState(null);
    const getUsername = (email:string) => {
        get(child(dbRef, 'users/')).then(res=>{
            const obUser = Object.values(res.val() as { [key: string]: unknown }[]).filter(user => user['email'] === email[0]);
            setOpUser(obUser[0] as any);
            setOpNick((obUser[0] as any)?.displayName);
        })
    }
    useEffect(() => {
        if (!id || !user) return;
        get(child(dbRef, `userRooms/${user.uid}/${id}/`)).then((res) => {
          if (res.val() === null) {
            setChatData(null);
            return;
          }
      
          getUsername(res.val()["userList"].filter((chatUser: string) => user.email !== chatUser));
          setChatData(res.val());
        });
      }, [id, user]);


    const chatCnt = useRef(15);

    //curProj.collection('projects').doc(pjid).collection('chats').doc(String(dmRoomId))
    return (
        <>
            {init && (
                    
                    <ChatContainer>
                        
                        <ChatInnerContainer height="10%">
                            <HeaderContainer>
                                <Header>
                                    <HeaderLeft>
                                        {opUser && <>
                                            {opUser["photoURL"] ? <>
                                            <Image src={opUser?.["photoURL"]} alt="상대방" width="30" height="30" style={{margin:"10px", borderRadius:"100px"}} layout="fixed"/>
                                            
                                            </> : <>
                                            <Avatar sx={{width:"30px", height:"30px", margin:"10px"}}/>

                                            </>
                                            }
                                        </>}

                                        <h4><strong>{id?opNick:"채팅할 상대를 클릭해주세요."}</strong></h4>
                                    </HeaderLeft>
<HeaderRight>
<button onClick={()=>auth.signOut()}>Log out</button>

</HeaderRight>
                                </Header>
                            </HeaderContainer>                            
                        </ChatInnerContainer>

                        <ChatInnerContainer height="95%">
                            {id && <>
                                <ChatBase id={id} chatData={chatData} opUser={opUser} />                  
                            </>}
                            {chatData && <ChatInput opUser={opUser} chatData={chatData}/>}

                        </ChatInnerContainer>
                    </ChatContainer>
            )}        
        </>
                


        

    )
}
export default memo(Chat);

const SidebarInfo = styled.div`
    display:flex;
    align-items: center;
    width:100%;
    button {
    }


`;
const ImageContainer = styled.div`
    position:relative;
`
const SidebarInfoS = styled.div<{fSize:number}>`
    @media (max-width: 1300px) {
        > h2 {
            opacity: 0;
        }
    }
        @media (min-width: 769px) and (max-width:1300px) {
        width:200px;
        opacity: 0;
    }
        @media (min-width: 1301px) and (max-width:2200px) {
        width:200px;
        font-size: ${(p)=>(p.fSize * 1.4 - 25 + "px")};
    }
    display:flex;
    margin:5px;
    width:100%;
    transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    justify-content: space-around;
    align-items: center;
    font-family: "Noto Sans KR";
    font-weight: 600;
    font-size:${(p)=>(p.fSize - 5 + "px")};
`

const HeaderAvatar = styled(Avatar)`
    top:0px;
    left:0px;
        transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    @media (max-width: 1300px) {
        top:-10px;
        left:-5px;
        transition-duration: 0.5s;
    transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    cursor:pointer;
    margin:5px;
    &:hover {
        opacity:0.8;
    }

    
`

const ChatContainer = styled.div`
    box-sizing: border-box;
    flex-grow:2;
    width:100%;
    height:100%;
    position:relative;
    background-color: white;
    overflow:hidden;
`
const ChatInnerContainer = styled.div<{height:any}>`
    box-sizing: border-box;
    height:${p=>p.height};
    position:relative;

    background-color: #404040;
    overflow:hidden;
`
const HeaderRight = styled.div`
    align-items: center;
    >p {
        align-items: center;
        font-size:14px;
    }
    > p > .MuiSvgIcon-root {
        margin-right: 5px !important;
        font-size: 16px;
    }
    button{
        margin-right:10px;
        background:gray;
        color:white;
        border:none;
        border-radius: 10px;
        padding:5px;

    }

`

const HeaderLeft = styled.div`
    display:flex;
    align-items: center;
    padding:20px;
    font-size:30px;
    color:white;
    > h4 {
        display:flex;
        text-transform: lowercase;
        margin-right:10px;
    }

    > h4 > .MuiSvgIcon-root {
        margin-left: 10px;
        font-size: 18px;
    }
`
const HeaderContainer = styled.div`
    position:relative;
    background-color: black;


`
const Header = styled.div`
    position:absolute;
    z-index:1;
    width:100%;
    display:flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid lightgray;
    height:60px;
    background-color:#080808;
`
const HeaderMargin = styled.div`
    margin-top: 60px;
    position:relative;
`