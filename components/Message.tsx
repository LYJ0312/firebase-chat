import styled from "styled-components";
import {memo, useMemo, useState} from "react";

import Image from "next/image";
import { Avatar, Button } from "@mui/material";
import { auth, database } from "../firebase";

type MessageProps = {
  message: string;
  timestamp: any;
  userImage: string;
  deleteMessage: () => void;
  email: string;
  nickname: string;
  user: any;
  type: string;
};

function Message({
  message,
  timestamp,
  deleteMessage,
  email,
  nickname,
  user,
  type,
}: MessageProps) {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <MessageContainer op={email === user.email}>
      <TextContainer op={email === user.email}>
        <h4>
          {nickname ? nickname : email}
          {email === user.email && (
            <Button
              style={{ opacity: hover ? "1" : "0" }}
              onClick={deleteMessage}
            >
              지우기
            </Button>
          )}
        </h4>
        <MessageText a={type === "text"}>
          {type === "text" ? (
            message
          ) : (
            <Image
              src={message}
              alt=""
              width="100"
              height="100"
              layout="fixed"
              style={{ borderRadius: "20px" }}
            />
          )}
        </MessageText>
      </TextContainer>
    </MessageContainer>
  );
}

export default memo(Message);

const MessageContainer = styled.div<{ op: boolean }>`
  display: flex;
  flex-direction: ${(p) => (p.op ? "row-reverse" : "row")};
  margin-top: ${(p) => (p.op ? "40px" : "0")};
  padding: 20px;
`;

const TextContainer = styled.div<{ op: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(p) => (p.op ? "flex-end" : "flex-start")};
  margin-left: ${(p) => (p.op ? "0" : "10px")};
  margin-right: ${(p) => (p.op ? "10px" : "0")};

  h4 {
    display: flex;
    justify-content: ${(p) => (p.op ? "flex-end" : "flex-start")};
    align-items: center;
  }
`;

const MessageText = styled.p<{ a: boolean }>`
  word-break: break-all;
  background-color: ${(p) => (p.a ? "white" : "none")};
  border-radius: 10px;
  padding: 10px;
  min-height: 50px;
  max-width: 60%;
  font-family: "Pretendard";
  font-size: 20px;
  color: black;
  margin-left: auto; /* Add this line */
}`  
