import styled from "styled-components";
import { database, auth} from "../firebase.js";
import Image from "next/image";
import { useStore } from "../utils/appState";
import Router from "next/router";
import EmailValidator from "email-validator";

import { Avatar } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { child, get, onValue, ref } from "firebase/database";
import { useEffect, useState, useRef } from "react";

const SidebarOptionContainer = styled.div`
    display:flex;
    font-size:12px;
    align-items:center;
    padding-left: 2px;
    width:100%;
    cursor:pointer;
    word-break:break-word;
    :hover {
        opacity:0.9;
        background-color: #340c36;
    }
    >svg {
        position:relative;
 
    }
    > h3 {
        font-weight: 500;
        font-family:"Pretendard";
        font-size:20px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: break-all;
    }

    > h3 > span {
        padding: 15px;
    }
`
const SidebarOptionChannel = styled.div`
    padding: 10px 0;
    font-weight: 300;
`
const UserAvatar = styled(Avatar)`
    margin:5px;
    margin-right:15px;
`
type ChatData = {
  userList: string[];
  roomId: string;
  // Add other properties as needed
};

interface SidebarOptionProps {
  chatData: ChatData;
}

function SidebarOption({ chatData }: SidebarOptionProps) {
  const [user] = useAuthState(auth);
  const { setRoomId } = useStore();
  const uniqueUserList = chatData.userList.filter(
    (chatUser, index) =>
      chatData.userList.indexOf(chatUser) === index && user?.email !== chatUser
  );
  const [opNick, setOpNick] = useState('');
  const obUser = useRef<any>(null); // obUser 변수 정의

  useEffect(() => {
    const fetchOpUser = async () => {
      const dbRef = ref(database);
      const res = await get(child(dbRef, 'users/'));
      const obUsera = Object.values(res.val() as Record<string, { email: string }>).filter(
        (u) => u.email === uniqueUserList[0]
      );
      obUser.current = obUsera[0];
      setOpNick(obUsera[0]?.email as string);
    };

    fetchOpUser();
  }, [uniqueUserList]);

  return (
    <>
      <SidebarOptionContainer onClick={() => setRoomId(chatData.roomId)}>
        {opNick ? (
          <>
            <Image
              src={obUser.current.photoURL}
              alt="상대방"
              width="30"
              height="30"
              style={{ margin: '10px', borderRadius: '100px' }}
              layout="fixed"
            />
          </>
        ) : (
          <>
            <Avatar sx={{ width: '30px', height: '30px', margin: '10px' }} />
          </>
        )}
        <h3>{opNick}</h3>
      </SidebarOptionContainer>
    </>
  );
}

export default SidebarOption;