import { Button } from "@mui/material";
import React, { memo, useEffect, useState, ChangeEvent, FormEvent  } from "react";
import styled from "styled-components";
import { auth, database } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { child, get, push, ref, serverTimestamp } from "firebase/database";
import { Send, Mic, FileUpload } from "@mui/icons-material";
import { useStore } from "../utils/appState";
import { getDownloadURL, getStorage, ref as refS, uploadString } from "firebase/storage";
import {v4 as uuidv4} from "uuid";

interface ChatInputProps {
  roomId: string;
}

function ChatInput({ chatData,opUser}) {
  const [input, setInput] = useState('');
  const [user] = useAuthState(auth);
  const {roomId} = useStore();

  const [attachment, setAttachment] = useState(null);
  const sendmessage = async (e) => {
    e.preventDefault();
  
    if (attachment) {
      const storage = getStorage();
      const fileRef = refS(storage, uuidv4());
      await uploadString(fileRef, attachment, "data_url");
      const fileURL = await getDownloadURL(refS(storage, fileRef));
  
      // Add the fileURL to the message data
      push(ref(database, `messages/${roomId}`), {
        message: fileURL,
        type: "image",
        timestamp: serverTimestamp(),
        user: user.displayName,
        userImage: user.photoURL,
        userEmail: user.email,
      });
  
      // Clear the attachment after uploading
      setAttachment(null);
    } else {
      if (!input) return;
  
      // Add the text message to the database
      push(ref(database, `messages/${roomId}`), {
        message: input,
        type: "text",
        timestamp: serverTimestamp(),
        user: user.displayName,
        userImage: user.photoURL,
        userEmail: user.email,
      });
  
      // Clear the input field after sending
      setInput("");
    }
  };

  const onClearAttachment = () => setAttachment(null);
  
  const onFileChange = (evt) => {
    const files = evt.target.files;
    const theFile = files[0];
  
    // FileReader 생성
    const reader = new FileReader();
  
    // file 업로드가 완료되면 실행
    reader.onloadend = (finishedEvent) => {
      // 업로드한 이미지 URL 저장
      const result = finishedEvent.currentTarget["result"];
      setAttachment(result);
    };
  
    // 파일 정보를 읽기
    reader.readAsDataURL(theFile);
  
    evt.target.value = "";
  };

  return (
    <OutterContainer>
      <ChatInputContainer onSubmit={(e) => sendmessage(e)}>
        <div>
          <AttachmentContainer>
            {attachment && (
              <div onClick={() => onClearAttachment()}>
                <img src={attachment} width="50px" height="50px" alt="" />
              </div>
            )}
          </AttachmentContainer>
          <InputContainer>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              type="text"
            />
          </InputContainer>
          <label htmlFor="fileinput">
            <FileUpload />
          </label>
          <button type="submit">
            <Send />
          </button>
        </div>
        <input
          id="fileinput"
          type="file"
          accept="image/*, audio/*"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
      </ChatInputContainer>
    </OutterContainer>
  );
}
  export default memo(ChatInput);

const OutterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
  margin: 0 auto;
  background-color: #b2b2b2;
`;

const ChatInputContainer = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  width: 99%;
  border-radius: 2px;
  background-color: white;
  padding: 1px;
  top: 5px;
  margin: 0 10px;
  justify-content: space-between; /* Align items to the left and right */

  div {
    display: flex;
    align-items: center;
    gap: 15px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1; /* Occupy remaining space */
  border-right: 1px solid #ccc; /* Add a border to separate message input and attachment */

  input {
    border: none;
    outline: none;
    padding: 5px 10px;
    flex: 1; /* Make the input occupy remaining space */
  }
`;

const AttachmentContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-right: 15px; /* Add some spacing to the right of the attachment */
`;