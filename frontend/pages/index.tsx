// import type { NextPage } from 'next'
// import React, { createContext, useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { 
//     Button,
//     ButtonGroup,
//     FormControl,
//     FormLabel,
//     HStack,
//     Input,
//     InputGroup,
//     InputLeftAddon,
//     Modal,
//     ModalBody,
//     ModalCloseButton,
//     ModalContent,
//     ModalFooter,
//     ModalHeader,
//     ModalOverlay,
//     PinInput,
//     PinInputField,
//     useDisclosure,
// } from '@chakra-ui/react';
// import { useRouter } from 'next/router';
// import { useRecoilState } from 'recoil';
// import { currentUserIDState } from '../contexts/user';
// import { NodeNextRequest } from 'next/dist/server/base-http/node';
// import { now } from 'lodash';


// const loginUrl = "http://127.0.0.1:8000/login";
// const authUrl = "http://127.0.0.1:8000/auth";

// export const Home: NextPage = () => {
//     const [name, setName] = useState("");
//     const [phoneNumber, setPhoneNumber] = useState("");
//     const [code, setCode] = useState("");
//     const [isCode, setIsCode] = useState(true);
//     const [isTime, setIsTime] = useState(true);
//     const [_, setUserId] = useRecoilState(currentUserIDState);
//     const router = useRouter()
//     const [min, setMin] = useState(5);
//     const [sec, setSec] = useState("00");
//     const [timer, setTimer] = useState("");
//     const time = useRef(15);
//     const timerld = useRef(null);

//     const handleName: React.ChangeEventHandler<HTMLInputElement> = (event) => {
//         setName(event.target.value);
//     }
//     const [isPinErr, setIsPinErr] = useState(true);
//     const [isTimeOut, setIsTimeOut] = useState(true);
//     const { isOpen, onOpen, onClose } = useDisclosure()

//     const handlePhoneNumber: React.ChangeEventHandler<HTMLInputElement> = (event) => {
//         setPhoneNumber(event.target.value);
//     }

//     const handleCode: ((value: string) => void) = (value) => {
//         setCode(value)
//     }

//     const sendUserData = () => {
//         const data = {
//             name: name,
//             phone_num: phoneNumber,
//         }

//         axios.post(loginUrl, data, {
//             headers: {
//                 "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
//             }
//         }).then((res) => {
//             setIsCode(false)
//             console.log(res)
//         })
//     }

//     const handleLogin: React.FormEventHandler<HTMLFormElement> = (event) => {
//         event.preventDefault();
//         sendUserData()
//     }
    
//     const handleAuth: React.FormEventHandler<HTMLFormElement> = (event) => {
//         event.preventDefault();
//         const data = {
//             name: name,
//             phone_num: phoneNumber,
//         }

//         axios.post(authUrl+`/${code}`, data).then((res) => {
//             if (res.status == 200){
//                 setUserId(res.data._id)
//                 router.push('/user')
//             }
            
//         }).catch((e)=>{
//             let errorCode = e.response.status;
//             console.log(errorCode);
//             if (errorCode == 400){//400: 핀번호 오류 - 핀번호 재입력 유도
//                 console.log(errorCode, "pin num error");
//                 setIsPinErr(false)
//                 onOpen()
//                 setCode("");
//             }else if(errorCode == 408){//408: 시간초과 - 핀번호 백으로 다시 요청해서 새로 받기
//                 console.log(errorCode, "time out");
//                 setIsTimeOut(false)
//                 onOpen()
//                 sendUserData()
//             }else if(errorCode == 404){//404: 사용자 데이터 입력 오류 - 사용자 정보(이름, 전화번호) 재입력
//                 console.log(errorCode, "other reason err");
//             }
//         })
//     }
    
    
//     const startTimer = () => {
//         setIsTime(false)
//     }

//     const Timer = () => {
//         useEffect(() => {
//             timerld.current = setInterval(() => {
//                 setMin(parseInt(time.current / 60));
//                 setSec(time.current % 60);
//                 time.current -= 1;
//             }, 1000);

//             return () => clearInterval(timerld.current);
//         }, []);

//         useEffect(() => {
//             if(time.current < 0){
//                 clearInterval(timerld.current);
//                 //sendUserData()
//             }
//         }, [sec]);

//         return(
//             <div>{min} : {sec}</div>
//         )
//     }

//     return (
//         <div>
//             <form onSubmit={isCode ? handleLogin : handleAuth}>
//                 <FormControl isRequired>
//                     <FormLabel htmlFor='name'>Name</FormLabel>
//                     <Input
//                         id='name'
//                         value={name}
//                         onChange={handleName}
//                     />
//                 </FormControl>
//                 <FormControl isRequired>
//                     <FormLabel htmlFor='phoneNumber'>PhoneNumber</FormLabel>
//                     <InputGroup>
//                         <InputLeftAddon children='+82' />
//                         <Input
//                             id='phoneNumber'
//                             value={phoneNumber}
//                             onChange={handlePhoneNumber}
//                             type='tel'
//                             placeholder='phone number'
//                         />
//                     </InputGroup>
//                 </FormControl>
//                 {
//                     isCode ? (
//                         <Button
//                             type='submit'
//                             colorScheme='blue'
//                             onClick={startTimer}
//                         >
//                             인증번호 받기
//                         </Button>
//                     ) : (
//                         <div>
//                             <PinInput otp value={code} onChange={handleCode}>
//                                 <PinInputField />
//                                 <PinInputField />
//                                 <PinInputField />
//                                 <PinInputField />
//                                 <PinInputField />
//                                 <PinInputField />
//                             </PinInput>
//                             <Button type='submit' colorScheme='blue'>
//                                 확인
//                             </Button>
//                             {/**/}
//                         </div>
//                     )
//                 }
//                 {
//                     isTime ? (
//                         <div></div>
//                     ) : (
//                         <Timer/>
//                     )
//                 }        
//             </form>
//             {
//                 isPinErr ? (
//                     <div></div>
//                 ) : (
//                     <div>
//                         <Modal isOpen={isOpen} onClose={onClose} isCentered>
//                             <ModalOverlay />
//                             <ModalContent>
//                                 <ModalHeader>Pin Number Error</ModalHeader>
//                             <ModalCloseButton />
//                                 <ModalBody>
//                                     핀 번호를 다시 확인해주세요.
//                                 </ModalBody>
//                             <ModalFooter>
//                                 <Button onClick={onClose}>
//                                     확인
//                                 </Button>
//                             </ModalFooter>
//                             </ModalContent>
//                         </Modal>
//                     </div>
//                 )
//             }
//             {
//                 isTimeOut ? (
//                     <div></div>
//                 ) : (
//                     <Modal isOpen={isOpen} onClose={onClose} isCentered>
//                         <ModalOverlay />
//                         <ModalContent>
//                             <ModalHeader>Time Out Error</ModalHeader>
//                         <ModalCloseButton />
//                             <ModalBody>
//                                 시간초과 입니다.
//                             </ModalBody>
//                         <ModalFooter>
//                             <Button onClick={onClose}>
//                                 확인
//                             </Button>
//                         </ModalFooter>
//                         </ModalContent>
//                     </Modal>
//                 )
//             }    
//         </div>
        
//     )
// }
// export default Home;