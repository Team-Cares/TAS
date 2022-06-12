import type { NextPage } from 'next'
import React, { createContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { 
    Button,
    ButtonGroup,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { currentUserIDState } from '../contexts/user';
import { NodeNextRequest } from 'next/dist/server/base-http/node';
import { now } from 'lodash';
import style from '../styles/Home.module.css';

const loginUrl = "http://127.0.0.1:8000/login";
const authUrl = "http://127.0.0.1:8000/auth";

export const Home: NextPage = () => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [code, setCode] = useState("");
    const [isCode, setIsCode] = useState(true);
    const [isTime, setIsTime] = useState(true);
    //const [_, setUserId] = useRecoilState(currentUserIDState);
    const router = useRouter()
    const [min, setMin] = useState("05");
    const [sec, setSec] = useState("00");
    const [timer, setTimer] = useState("");
    const time = useRef(299);
    const timerld = useRef<number>(0);

    React.useEffect(()=>{
        window.localStorage.removeItem("userID");
    },[]);

    const handleName: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setName(event.target.value);
    }
    const [isPinErr, setIsPinErr] = useState(true);
    const [isTimeOut, setIsTimeOut] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handlePhoneNumber: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setPhoneNumber(event.target.value);
    }

    const handleCode: ((value: string) => void) = (value) => {
        setCode(value)
    }

    const sendUserData = () => {
        const data = {
            name: name,
            phone_num: phoneNumber,
        }

        axios.post(loginUrl, data, {
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
            }
        }).then((res) => {
            /*if ((name.value !== null)&&(phoneNumber.value !== null)){
                
            }*/
            setIsCode(false)
            console.log(res)
        })
    }

    const handleLogin: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        sendUserData()
    }
    
    const handleAuth: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const data = {
            name: name,
            phone_num: phoneNumber,
        }

        axios.post(authUrl+`/${code}`, data).then((res) => {
            if (res.status == 200){
                //setUserId(res.data._id)
                window.localStorage.setItem("userID", res.data._id)
                router.push('/user')
            }
            
        }).catch((e)=>{
            let errorCode = e.response.status;
            console.log(errorCode);
            if (errorCode == 400){//400: 핀번호 오류 - 핀번호 재입력 유도
                console.log(errorCode, "pin num error");
                setIsPinErr(false)
                onOpen()
                setCode("");
            }else if(errorCode == 408){//408: 시간초과 - 핀번호 백으로 다시 요청해서 새로 받기
                console.log(errorCode, "time out");
                setIsTimeOut(false)
                onOpen()
                sendUserData()
            }else if(errorCode == 404){//404: 사용자 데이터 입력 오류 - 사용자 정보(이름, 전화번호) 재입력
                console.log(errorCode, "other reason err");
            }
        })
    }
    
    
    const startTimer = () => {
        setIsTime(false)
    }

    const Timer = () => {
        useEffect(() => {
            timerld.current = setInterval(() => {
                setMin("0"+String(parseInt(String(time.current / 60))));
                setSec(String(time.current % 60));
                time.current -= 1;
            }, 1000);

            return () => clearInterval(timerld.current);
        }, []);

        useEffect(() => {
            if(time.current < 0){
                clearInterval(timerld.current);
                //sendUserData()
            }
        }, [sec]);

        return(
            <div className={style.timer}>{min} : {sec}</div>
        )
    }

    return (
        <div className={style.container}>
            <div className={style.total}>
                <div className={style.logInArea}>
                    <form onSubmit={isCode ? handleLogin : handleAuth}>
                        <div className={style.headText}>
                            <div className={style.textH}>
                                <h1>T A S
                                <p>Client</p>
                                </h1>
                            </div>
                        </div>
                        <FormControl isRequired>
                            <FormLabel htmlFor='name' style={{
                                color: 'white'
                            }}>Name</FormLabel>
                            <Input
                                id='name'
                                value={name}
                                onChange={handleName}
                                placeholder='name'
                                style={{color: 'white'}}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel htmlFor='phoneNumber' style={{
                                color: 'white'
                            }}>PhoneNumber</FormLabel>
                            <InputGroup>
                                <InputLeftAddon children='+82' />
                                <Input
                                    id='phoneNumber'
                                    value={phoneNumber}
                                    onChange={handlePhoneNumber}
                                    type='tel'
                                    placeholder='phone number'
                                    style={{color: 'white'}}
                                />
                            </InputGroup>
                        </FormControl>
                        {
                            isCode ? (
                                <button 
                                    className={style.pinSubmit}
                                    type='submit'
                                    onClick={startTimer}
                                >
                                    인증번호 받기
                                </button>
                            ) : (
                                <div className={style.pinInput}>
                                    <div className={style.pinArea}>
                                        <div className={style.pin_submit}>
                                            <div className={style.Pin}>
                                                <PinInput
                                                    otp value={code} 
                                                    onChange={handleCode} 
                                                >
                                                    <PinInputField style={{opacity: '0.8', borderColor: '#FFC800', color: 'black', backgroundColor: 'white'}}/>
                                                    <PinInputField style={{opacity: '0.8', borderColor: '#FFC800', color: 'black', backgroundColor: 'white'}}/>
                                                    <PinInputField style={{opacity: '0.8', borderColor: '#FFC800', color: 'black', backgroundColor: 'white'}}/>
                                                    <PinInputField style={{opacity: '0.8', borderColor: '#FFC800', color: 'black', backgroundColor: 'white'}}/>
                                                    <PinInputField style={{opacity: '0.8', borderColor: '#FFC800', color: 'black', backgroundColor: 'white'}}/>
                                                    <PinInputField style={{opacity: '0.8', borderColor: '#FFC800', color: 'black', backgroundColor: 'white'}}/>
                                                </PinInput>
                                            </div>
                                            <button className={style.Submit} type='submit'>
                                                <p>확인</p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        {
                            isTime ? (
                                <div></div>
                            ) : (
                                <Timer/>
                            )
                        }        
                    </form>
                </div>
            </div>
            {
                isPinErr ? (
                    <div></div>
                ) : (
                    <div>
                        <Modal isOpen={isOpen} onClose={onClose} isCentered>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Pin Number Error</ModalHeader>
                            <ModalCloseButton />
                                <ModalBody>
                                    핀 번호를 다시 확인해주세요.
                                </ModalBody>
                            <ModalFooter>
                                <Button onClick={onClose}>
                                    확인
                                </Button>
                            </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                )
            }
            {
                isTimeOut ? (
                    <div></div>
                ) : (
                    <Modal isOpen={isOpen} onClose={onClose} isCentered>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Time Out Error</ModalHeader>
                        <ModalCloseButton />
                            <ModalBody>
                                시간초과 입니다.
                            </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose}>
                                확인
                            </Button>
                        </ModalFooter>
                        </ModalContent>
                    </Modal>
                )
            }    
        </div>
    )
}
export default Home;