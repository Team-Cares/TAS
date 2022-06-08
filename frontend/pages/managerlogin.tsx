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
import { currentManagerIDState} from'../contexts/manager';
// import { NodeNextRequest } from 'next/dist/server/base-http/node';
// import { now } from 'lodash';


const loginUrl = "http://127.0.0.1:8000/manager/login";
const createUrl = "http://127.0.0.1:8000/create/manager";

export const Home: NextPage = () => {
    const [Id ,setId] = useState("");
    const [passWord, setPassword] = useState("");
    const [_, setManagerId] = useRecoilState(currentManagerIDState);
    const router = useRouter()

    // const [code, setCode] = useState("");
    // const [isPinErr, setIsPinErr] = useState(true);
    // const [isTimeOut, setIsTimeOut] = useState(true);
    // const { isOpen, onOpen, onClose } = useDisclosure()

    React.useEffect(() => {
        createManager()
      }, [])
    
    const createManager= () => {
        axios.get(createUrl).then((res) => {
            console.log(res);
        })
    }

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
                setManagerId(res.data);
                router.push('/admin');
            }
        })
    }
    
    // const handleAuth: React.FormEventHandler<HTMLFormElement> = (event) => {
    //     event.preventDefault();
    //     const data = {
    //         name: name,
    //         phone_num: phoneNumber,
    //     }

    //     axios.post(authUrl+`/${code}`, data).then((res) => {
    //         if (res.status == 200){
    //             setUserId(res.data._id)
    //             router.push('/user')
    //         }
            
    //     }).catch((e)=>{
    //         let errorCode = e.response.status;
    //         console.log(errorCode);
    //         if (errorCode == 400){//400: 핀번호 오류 - 핀번호 재입력 유도
    //             console.log(errorCode, "pin num error");
    //             setIsPinErr(false)
    //             onOpen()
    //             setCode("");
    //         }else if(errorCode == 408){//408: 시간초과 - 핀번호 백으로 다시 요청해서 새로 받기
    //             console.log(errorCode, "time out");
    //             setIsTimeOut(false)
    //             onOpen()
    //         }else if(errorCode == 404){//404: 사용자 데이터 입력 오류 - 사용자 정보(이름, 전화번호) 재입력
    //             console.log(errorCode, "other reason err");
    //         }
    //     })
    // }
    
    return (
        <div>
            <form onSubmit={handleLogin}>
                <FormControl isRequired>
                    <FormLabel htmlFor='ID'>아이디</FormLabel>
                    <Input
                        id='ID'
                        value={Id}
                        onChange={handleID}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor='PW'>비밀번호</FormLabel>
                    <InputGroup>
                        {/* <InputLeftAddon children='+82' /> */}
                        <Input
                            id='PW'
                            value={passWord}
                            onChange={handlePW}
                            //type='tel'
                            //placeholder='phone number'
                        />
                    </InputGroup>
                </FormControl>
                {
                    <Button
                        type='submit'
                        colorScheme='blue'
                    >
                        Login
                    </Button>
                }
            </form>
        </div>
        //     {
        //         isPinErr ? (
        //             <div></div>
        //         ) : (
        //             <div>
        //                 <Modal isOpen={isOpen} onClose={onClose} isCentered>
        //                     <ModalOverlay />
        //                     <ModalContent>
        //                         <ModalHeader>Pin Number Error</ModalHeader>
        //                     <ModalCloseButton />
        //                         <ModalBody>
        //                             핀 번호를 다시 확인해주세요.
        //                         </ModalBody>
        //                     <ModalFooter>
        //                         <Button onClick={onClose}>
        //                             확인
        //                         </Button>
        //                     </ModalFooter>
        //                     </ModalContent>
        //                 </Modal>
        //             </div>
        //         )
        //     }  
        // </div>
    )
}
export default Home;