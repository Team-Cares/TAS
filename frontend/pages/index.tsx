import type { NextPage } from 'next'
import React, { createContext, useEffect, useState } from 'react';
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
    PinInput,
    PinInputField,
    usePinInput
} from '@chakra-ui/react';

const loginUrl = "http://127.0.0.1:8000/login";
const authUrl = "http://127.0.0.1:8000/auth";

export const Home: NextPage = () => {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [code, setCode] = useState("");
    const [isCode, setIsCode] = useState(true);
    const ab = 123;
    const handleName: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setName(event.target.value);
    }

    const handlePhoneNumber: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        setPhoneNumber(event.target.value);
    }

    const handleCode: ((value: string) => void) = (value) => {
        setCode(value)
    }

    const handleLogin: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        const data = {
            name: name,
            phone_num: phoneNumber,
        }

        axios.post(loginUrl, data, {
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
            }
        }).then((res) => {
            setIsCode(false)
            console.log(res)
        })
    }

    const handleAuth: React.FormEventHandler<HTMLFormElement> = (event) => {
            
        event.preventDefault();
        const data = {
            name: name,
            phone_num: phoneNumber,
        }
        
        axios.post(authUrl+`/${code}`, data).then((res) => {
            console.log(res.status);
            console.log(res.data._id);
            
            if (res.status == 200){
                console.log("good");
                window.location.assign('/user');
            }
        }).catch((e)=>{
            let errorCode = e.response.status;
            console.log(errorCode);
            if (errorCode == 400){
                console.log(errorCode, "pin num error");
            }else if(errorCode == 408){
                console.log(errorCode, "time out");
            }else{
                console.log(errorCode, "other reason err");
            }
        })
    }

    return (
        <div>
            <form onSubmit={isCode ? handleLogin : handleAuth}>
                <FormControl isRequired>
                    <FormLabel htmlFor='nmae'>Name</FormLabel>
                    <Input
                        id='name'
                        value={name}
                        onChange={handleName}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor='phoneNumber'>PhoneNumber</FormLabel>
                    <InputGroup>
                        <InputLeftAddon children='+82' />
                        <Input
                            id='phoneNumber'
                            value={phoneNumber}
                            onChange={handlePhoneNumber}
                            type='tel'
                            placeholder='phone number'
                        />
                    </InputGroup>
                </FormControl>
                {
                    isCode ? (
                        <Button
                            type='submit'
                            colorScheme='blue'
                        >
                            인증번호 받기
                        </Button>
                    ) : (
                        <>
                            <PinInput otp value={code} onChange={handleCode}>
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                                <PinInputField />
                            </PinInput>
                            <Button
                                type='submit'
                                colorScheme='blue'
                            >
                                확인
                            </Button>
                        </>
                    )
                }                
            </form>
        </div>
    )
}
export default Home;