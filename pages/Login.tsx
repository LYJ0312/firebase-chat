import { ref, set } from "firebase/database";
import React, { FormEvent, useState,useEffect,MouseEvent} from "react";
import styled from "styled-components";
import { auth, loginEmail, signupEmail, loginGoogle,loginFacebook, database } from "../firebase.js";
import Image from "next/image";
import { Google } from "@mui/icons-material";
import FacebookIcon from '@mui/icons-material/Facebook';

const BackGround=styled.div`
    position:relative;
    width:100vw;
    height:100vh;
    background-color:aliceblue;
`
const Container = styled.div`
    position:relative;
    min-height:350px;
    min-width:600px;
    width:20%;
    height:60%;
    max-width: 700px;
    overflow:auto;
    border:1px solid lightgray;
    border-radius: 3px;
    top:50%;
    left:50%;
    padding-right:10px;
    transform:translate(-50%, -65%);
    text-align:center;
    background-color: #FFFFFF;
`
const PrettyInput = styled.input`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 18px 19px;
    font-size:15px;
    font-color:lightgray;
    gap: 10px;
    margin:auto;
    width: 80%;
    height:60px;
    margin-bottom:20px;
    background: #FFFFFF;
    border-radius: 5px;
    border:1px solid lightgray;
    &:hover {
        background-color: transparent;
        border: 1px solid gray;
        background-color: white; 
      }
    &:focus {
        border: 1px solid gray;
        outline: none;
      }
    &::placeholder {
        color: lightgray;
      }
    
    /* Inside auto layout */

    flex: none;
    order: 0;
    flex-grow: 0;

`
const Logo=styled.h1`
    color:black;
    align-items: flex-start;
    font-size:34px;
    height: 26px;
    margin-bottom:7%;
    
`

const PrettyButtonLogin = styled.div`
    position:relative;
    width:80%;
    height:45px;
    border-radius:5px;
    background-color: #116AD4;
    margin:auto;
    margin-bottom:20px;
     cursor:pointer;
     h2 {
        font-size: 18px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color:white;
        margin: 0;
        padding: 0;
     }
     &:hover {
        background-color: #1060C0;
      }
     &:focus {
        background-color: #1060C0;
      }
`

const PrettyButtonFacebook = styled.div`
    position:relative;
    display:flex;
    width:470px;
    height:40px;
    border-radius:90px;
    background-color: #3B5998;
    margin:auto;
    margin-bottom:20px;
     cursor:pointer;
     h2 {
        position:absolute;
        left:50%;
        transform:translate(-50%, -50%);
        color:white;
     }
     svg{
        position:relative;
        top:50%;
        transform:translateY(-50%);
        left:10px;
     }
     
`

const PrettyButtonGoogle = styled.div`
    position:relative;
    display:flex;
    width:470px;
    height:40px;
    border-radius:90px;
    background-color: #FF6D6D;
    margin:auto;
    margin-bottom:20px;
     cursor:pointer;
     h2 {
        position:absolute;
        left:50%;
        transform:translate(-50%, -50%);
        color:white;
     }
     svg{
        position:relative;
        top:50%;
        transform:translateY(-50%);
        left:10px;
     }
     
`

const StyledPl = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 50px;

  &::before,
  &::after,
  .line {
    content: "";
    height: 1px;
    background-color: lightgray;
  }

  &::before {
    margin-right: 60px;
  }

  &::after {
    margin-left: 60px;
  }

  .line {
    flex: 1;
    margin: 0 0px;
  }

  span {
    font-size: 14px;
    color: gray;
    margin: 0 20px;
  }
`
const Containerl = styled.div`
    position:relative;
    min-height:10px;
    min-width:600px;
    width:20%;
    height:10%;
    max-width: 700px;
    overflow:auto;
    border:1px solid lightgray;
    border-radius: 3px;
    top:10%;
    left:50%;
    padding-right:10px;
    transform:translate(-50%, 15%);
    text-align:center;
    background-color: #FFFFFF;
`
const PrettyButtonRegister = styled.div`
    position:center;
    width:80%;
    height:45px;
    border-radius:5px;
    background-color: white;
    margin: 25px auto 0;
    cursor:pointer;
    border:1px solid #116AD4;
    h2 {
        font-size: 16px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color:#116AD4;
        margin: 0;
        padding: 0;
    }
    &:hover {
        background-color: transparent;
        border: 1px solid #116AD4;
        background-color: #E6F0FB; 
      }

`
interface MyErrorType extends Error {
  message: string;
  // Other properties specific to your error type
}


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
  
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      if (name === "email") {
        setEmail(value);
      } else if (name === "password") {
        setPassword(value);
      }
    };
  
    const onSubmit = async (authFunction: (email: string, password: string) => Promise<any>) => {
      try {
        let data;
        if (newAccount) {
          data = await loginEmail(email, password);
          setNewAccount(false);
        } else {
          data = await signupEmail(email, password);
          alert("회원가입이 완료되었습니다.");
        }
        console.log(data);
      } catch (err: MyErrorType | any) {
        setError(err.message);
      }
    };

    const onSocial = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      try {
        await loginGoogle();
      } catch (err) {
        console.log(err);
      }
    };
    const onSocialFacebook = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      try {
        await loginFacebook();
      } catch (err) {
        console.log(err);
      }
    };


    return <>
        <BackGround>
            <Container>
                <div>
                    <Logo>Cpst Chat</Logo>

                    <PrettyInput
                        name="email"
                        type="email"
                        placeholder="이메일을 입력해 주세요."
                        value={email}
                        onChange={onChange}
                    />
                    <PrettyInput
                        name="password"
                        type="password"
                        placeholder="비밀번호를 입력해 주세요."
                        value={password}
                        onChange={onChange}
                    />
                    {/* {!newAccount &&                 
                    <button onClick={e=>onSocial(e)}>구글로 계속하기</button>
                        } */}
                    <PrettyButtonLogin
                     onClick={() =>
                    onSubmit(newAccount ? signupEmail : loginEmail)
                    }>
                    <h2>{newAccount ? "로그인" : "회원가입"}</h2>
                    </PrettyButtonLogin>
                    {error && <span>{error}</span>}
                    
                    <StyledPl>
                    <div className="line"></div>
                    <div className="line"></div>
                    <span>또는</span>
                    <div className="line"></div>
                    <div className="line"></div>
                </StyledPl>
                </div>

                    <PrettyButtonFacebook onClick={onSocialFacebook as any}>
                        <FacebookIcon fontSize="large" />
                        
                        <h2>Facebook</h2></PrettyButtonFacebook>

                    <PrettyButtonGoogle onClick={onSocial as any}>
                        <Google fontSize="large"/>

                        <h2>Google</h2></PrettyButtonGoogle>
    
             </Container>

            <Containerl>
                
                <PrettyButtonRegister onClick={()=>setNewAccount(!newAccount)}>
                    <h2>{newAccount ? "회원가입 하기" : "로그인 하기"}</h2>
                </PrettyButtonRegister>

            </Containerl>
        </BackGround>
    </>
}

export default Login;