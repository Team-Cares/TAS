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
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentManagerIDState, currentManagerQuery } from '../contexts/manager';
import { NodeNextRequest } from 'next/dist/server/base-http/node';
import style from '../styles/Admin.module.css';

const ManagerUrl = "http://127.0.0.1:8000/manager/counserting";
const ManagerStatusUrl = "http://127.0.0.1:8000/manager"

export const Admin: NextPage = () => {
    const [status, setStatus] = useState("");
    const [QA_id, setQAId] = useState("");
    const managerinfo = useRecoilValue(currentManagerQuery)
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [userName, setUserName] = useState("");
    const [isCode, setIsCode] = useState("");
    const [_, setUserId] = useRecoilState(currentManagerIDState);
    const router = useRouter()

    React.useEffect(() => {
        console.log(managerinfo);
      }, [])
    
    const onStart = () => {
        setStatus("Start");
        axios.get(ManagerUrl,{
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
            }
        }).then((res) => {
            console.log(res)
            if (res.status == 200){
                setQAId(res.data.QA_id);
                setTitle(res.data.title);
                setContent(res.data.contents);
                setUserName(res.data.userName);
            }else{
                console.log("Error")
            }
        })
        

    }

    const onAccept = () => {
        setStatus("Accept");
        const url =  ManagerStatusUrl + "/" + QA_id + "/202"
        axios.post(url,{
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
            }
        }).then((res) => {
            console.log(res)
        })
    }

    const onReject = () => {
        setStatus("Reject");
        const url =  ManagerStatusUrl + "/" + QA_id + "/503"
        axios.post(url,{
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
            }
        }).then((res) => {
            console.log(res)
        })
    }

    const onComplete = () => {
        setStatus("Complete");
        const url =  ManagerStatusUrl + "/" + QA_id + "/200"
        axios.post(url,{
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
            }
        }).then((res) => {
            console.log(res)
        })

    }

    return (
        <div className={style.container}>
            <div className={style.adminInfo}></div>
            <div className={style.btnGroup}>
                <button 
                    className={style.btnStart}
                    onClick={onStart}>상담 시작
                </button>
                <button 
                    className={style.btnAccept}
                    onClick={onAccept}>상담 수락
                </button>

                <button 
                    className={style.btnReject}
                    onClick={onReject}>상담 거부
                </button>

                <button 
                    className={style.btnComplete}
                    onClick={onComplete}>상담 완료
                </button>
            </div>
            <div>{status}</div>
        </div>
    )
}
export default Admin;