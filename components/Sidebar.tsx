
import styled from "styled-components";
import firebase from "firebase/app";
import { Add, Apps, BookmarkBorder, Create, Drafts, ExpandLess, ExpandMore, FileCopy, Inbox, InsertComment, PeopleAlt } from "@mui/icons-material";
import SidebarOption from "./SidebarOption";
import { auth, database } from "../firebase";
import {getDatabase, child, get, push, ref, set} from "firebase/database";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "../utils/appState";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "../utils/getRecipientEmail";
import EmailValidator from "email-validator";
import Router from "next/router";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";
import Image from "next/image";
import { serverTimestamp } from "firebase/database";
import { Avatar } from "@mui/material";
const SidebarContainer = styled.div`
    
    color: white;
    background-color : #020f03;
    flex:0.3;
    border-top: 1px solid c;
    max-width: px;
    > hr {
        margin-top: 10px;
        margin-bottom: 10px;
        border: 1px solid #251355;
    }
`;

const SidebarHeader = styled.div`
    display:flex;
    box-sizing: border-box;

    border-bottom: 1px solid #251355;
    padding: 30px;
    background-color:  #272727;
    > .MuiSvgIcon-root {
        padding:6px;
        color: #49274b;
        font-size: 25px;
        background-color: white;
        border-radius: 999px;
    }
`;
const SidebarInfo = styled.div`
    display:flex;
    > h2 {
        font-size: 20px;
        font-weight: 900;
        margin:0;
        right:25px;
        position:relative;
        top:50%;
        transform:translateY(-20%);
        margin-left:123px;
        overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
    }
    > h3 {
        display:flex;
        font-size: 13px;
        font-weight: 400;
        align-items: center;
    }
    > h3 > .MuiSvgIcon-root {
        font-size: 14px;
        margin-top: 1px;
        margin-right: 2px;
        color: green;
    }
    button {
        position: absolute;
        background-color: none;
        background:mintcream;
        border:none;
        height:20px;
        
}
`;

const SidebarOptionContainer = styled.div`
    display:flex;
    font-size:12px;
    align-items:center;
    padding-left: 2px;
    box-sizing: border-box;

    cursor:pointer;
    word-break:break-word;
    :hover {
        opacity:0.9;
        background-color: #340c36;
    }
    > h3 {
        font-weight: 500;
    }
    > h3 > span {
        padding: 15px;
        box-sizing: border-box;

    }
`

const EditButton = styled.div`
    
    cursor:pointer;
    >input {
        background-color: transparent;
        border:none;
        text-align:center;
        min-width: 30vw;
        outline:0;
        color:white;
    }
`
const ImageContainer = styled.div`
    position:relative;
`
const SearchContainer = styled.div`
    position:relative;
    width:100%;
    height:50px;
    border-bottom: 1px solid #ffffff;
    svg {
        position:absolute;
        right:10px;
        top:50%;
        transform: translateY(-50%);
        opacity:0.5;
    }
`
const SearchBar = styled.input`
    position:relative;
    box-sizing: border-box;

    width:100%;
    height:100%;
    padding:20px;
    outline:none;
    border:none;
    color:white;
    font-family: "Pretendard";
    background:  #262626;
    font-size:18px;
    &::placeholder {
        color:#D3D3D3CC;
       
    }
`
interface ChatData {
  userList: string[];
  roomId: string;
  // Add other properties as needed
}

function Sidebar() {
  const [user] = useAuthState(auth);
  const dbRef = ref(database);
  const [search, setSearch] = useState('');
  const [snapshot, setSnapshot] = useState([]);
  const [finalRes, setFinalRes] = useState([]);

  useEffect(() => {
    get(child(dbRef, `userRooms/${user?.uid}`)).then((res) => {
      if (!res.val()) return;
      const rooms = Object.values(res.val());
      setSnapshot(rooms);
      setFinalRes(rooms);
    });
  }, [dbRef, user]);

  useEffect(() => {
    if (!search) {
      setFinalRes(snapshot);
    } else {
      const searchQueryLower = search.toLowerCase();
      const searchResults = snapshot.filter((user) => {
        const displayName = user.displayName?.toLowerCase();
        const email = user.email?.toLowerCase();
        return (
          displayName?.includes(searchQueryLower) || email?.includes(searchQueryLower)
        );
      });
      setFinalRes(searchResults);
    }
  }, [search, snapshot]);
  const onChange = (e) => {
    const searchQuery = e.target.value.trim();
    setSearch(searchQuery);
  };

  const chatAlreadyExists = (recipientEmail) => {
    return get(child(dbRef, `userRooms/${user?.uid}`)).then((res) => {
      const rooms = res.val();
      if (!rooms) return false;
      return Object.values(rooms).some((room) => {
        const typedRoom = room as { userList: string[] };
        return typedRoom.userList.find((user) => user === recipientEmail) !== undefined;
      });
    }).catch((error) => {
      console.log(error);
      return false;
    });
  };
  const getUserId = (email) => {
    return get(child(dbRef, 'users')).then((res) => {
      const obUser = Object.values(res.val()).filter((user) => user['email'] === email);
      return obUser[0]['uid'];
    });
  };
  
  const isExist = (email) => {
    return get(child(dbRef, 'users')).then((res) => {
      const obUser = Object.values(res.val()).filter((user) => user['email'] === email);
      return !!obUser.length;
    });
  };
  
  const addDm = () => {
    const targetEmail = prompt("DM할 이메일을 써주세요");
    if (!targetEmail) return null;
  
    isExist(targetEmail).then((res) => {
      if (!res) {
        alert("등록되지 않은 사용자입니다.");
        return;
      } else if (EmailValidator.validate(targetEmail)) {
        chatAlreadyExists(targetEmail).then((exists) => {
          if (exists) {
            alert("이미 해당 사용자와의 대화방이 존재합니다.");
            return;
          }
  
          const newRoomUsersRef = push(ref(database, "roomUsers/"));
          const roomId = newRoomUsersRef.key;
          const userList = [user?.email, targetEmail];
  
          set(ref(database, `userRooms/${user?.uid}/${roomId}`), {
            lastMessage: "",
            timestamp: serverTimestamp(), // 서버 타임스탬프 사용
            roomId: roomId,
            userList: userList,
          });
      
          getUserId(targetEmail).then((resm) => {
            set(ref(database, `userRooms/${resm}/${roomId}`), {
              lastMessage: "",
              timestamp: serverTimestamp(), // 서버 타임스탬프 사용
              roomId: roomId,
              userList: userList,
            });
          });
        });
      } else {
        alert("유효한 이메일을 입력하세요.");
      }
    });
  };
    return (
      <SidebarContainer>
        <SidebarHeader>
          <SidebarInfo>
            <ImageContainer>
              {user?.photoURL ? (
                <Image
                  src={user?.photoURL}
                  alt=""
                  width="60"
                  height="60"
                  layout="fixed"
                  style={{ borderRadius: "20px" }}
                />
              ) : (
                <Avatar sx={{ width: "30px", height: "30px", margin: "10px" }} />
              )}
            </ImageContainer>
            <h2>{user && user.displayName ? user.displayName : user?.email}</h2>
          </SidebarInfo>
        </SidebarHeader>
    
        <SearchContainer>
          <SearchBar
            value={search}
            onChange={onChange}
            placeholder="검색"
          />
          <SearchIcon />
        </SearchContainer>
    
        <SidebarOptionContainer onClick={addDm}>
          <Add fontSize="small" style={{ padding: "2px" }} />
          <h3>DM 생성</h3>
        </SidebarOptionContainer>
    
        {finalRes.map((user) => (
          <SidebarOption key={user.uid} chatData={user} />
        ))}
      </SidebarContainer>
    );
}

export default memo(Sidebar);
