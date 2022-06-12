import type { NextPage } from 'next'
import React, { createContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { 
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
//import { useRecoilState } from 'recoil';
//import { currentManagerIDState} from'../contexts/manager';
import style from '../styles/ManagerHome.module.css';

const loginUrl = "http://127.0.0.1:8000/manager/login";
const createUrl = "http://127.0.0.1:8000/create/manager";

export const ManagerHome: NextPage = () => {
    const [Id ,setId] = useState("");
    const [passWord, setPassword] = useState("");
    //const [_, setManagerId] = useRecoilState(currentManagerIDState);
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isPw, setIsPw] = useState(true);
    const [isUser, setIsUser] = useState(true);

    React.useEffect(() => {
        window.localStorage.clear();
        //createManager()
      }, [])
    
    // const createManager= () => {
    //     axios.get(createUrl).then((res) => {
    //         console.log(res);
    //     })
    // }

    const handleID: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setId(event.target.value);
    }
    const handlePW: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setPassword(event.target.value);
    }

    const handleLogin: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const managerData = {
            id: Id,
            pw: passWord
        }

        axios.post(loginUrl, managerData, {
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
            }
        }).then((res) => {
            console.log(res);
            if (res.status == 200){
                window.localStorage.setItem("ManagerID", res.data);
                //setManagerId(res.data);
                router.push('/admin');
            }
        }).catch((e)=>{
            let errorCode = e.response.status;
            if(errorCode == 400){//비밀번호 틀림
                setIsPw(false);
                onOpen()
            }else if(errorCode == 404){//아이디 틀림 혹은 유저 없음
                console.log('asdfasdf');
                setIsUser(false);
                onOpen()
            }else{
                alert('server error')
            }
        })
        setIsPw(true);
        setIsUser(true);
    }
    
    return (
        <div className={style.container}>
            <div className={style.total}>
                <div className={style.logInArea}>
                    <div>
                    <div className={style.headText}>
                        <div>
                            <h1 className={style.textH}>T A S</h1>
                        </div>
                    </div>
                        <form onSubmit={handleLogin}>
                            <FormControl isRequired>
                                <FormLabel htmlFor='ID' style={{color: 'white'}}>ID</FormLabel>
                                <Input
                                    id='ID'
                                    value={Id}
                                    onChange={handleID}
                                    placeholder='ID'
                                    style={{color: 'white'}}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel htmlFor='PW' style={{color: 'white'}}>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        id='PW'
                                        value={passWord}
                                        onChange={handlePW}
                                        type='password'
                                        placeholder='PassWord'
                                        style={{color: 'white'}}
                                    />
                                </InputGroup>
                            </FormControl>
                            
                            {
                                <button type='submit' className={style.Submit}>
                                    Login
                                </button>
                            }
                        </form>
                    </div>
                </div>
            </div>
            {
                isPw ? (
                    <div></div>
                ) : (
                    <div>
                        <Modal isOpen={isOpen} onClose={onClose} isCentered>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>PassWord Error</ModalHeader>
                            <ModalCloseButton />
                                <ModalBody>
                                    비밀번호를 다시 입력해주세요.
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
                isUser ? (
                    <div></div>
                ) : (
                    <div>
                        <Modal isOpen={isOpen} onClose={onClose} isCentered>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>User Error</ModalHeader>
                            <ModalCloseButton />
                                <ModalBody>
                                    등록되지 않은 아이디입니다.
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
        </div>
    )
}
export default ManagerHome;