import type { NextPage } from 'next'
import React, { createContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser, faContactCard, faRightFromBracket, faSquareXmark} from "@fortawesome/free-solid-svg-icons";
import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    FormControl,
    FormLabel,
    Fade,
    Input,
    Progress, 
    Textarea,
    useDisclosure,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import style from '../styles/Admin.module.css';
import { setRevalidateHeaders } from 'next/dist/server/send-payload';

const ManagerUrl = "http://127.0.0.1:8000/manager/counserting";
const ManagerStatusUrl = "http://127.0.0.1:8000/manager"

export const Admin: NextPage = () => {

    // Get ManagerToken at localStorage
    const getManagerId = () => {
        if (typeof window !== "undefined") {
            return window.localStorage.getItem("ManagerID");
        }
    }

    const [managerToken] = useState(getManagerId);
    const [managerName, setManagerName] = useState("");
    const [position, setPosition] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [QA_id, setQAId] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [userName, setUserName] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const { isOpen: isOpen1, onOpen, onClose} = useDisclosure();
    const { isOpen: isOpen2, onToggle} = useDisclosure();
    const [startvisible, setStratVisible] = useState(true);
    const [boxbtnvisible, setBoxBtnVisible] = useState(false);
    const [completevisible, SetCompleteVisible] = useState(false);
    const [rejectvisible, SetRejectVisible] = useState(true);
    const [closevisile, SetClosevisible] = useState(true);
    const [barvisible, setBarVisible] = useState(true);


    useEffect(() => {
        getMangerInfo();
      }, [])
    
    const resetContents = () => {
        setTitle("")
        setContent("")
        setUserName("")
        setPhoneNum("")
    }
    // Get Admin Infomation
    const getMangerInfo = async () => {
        const getManagerUrl = "http://127.0.0.1:8000/get/manager/";
        await axios.get(getManagerUrl + managerToken,{
          headers: {
            "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
          }
        }).then((res) => {
            setManagerName(res.data.name);
            setPosition(res.data.position);
            setDepartment(res.data.department);
        });
    }
    
    // Click Start Button
    const onStart = () => {
        setStatus("Start");
        axios.get(ManagerUrl,{
            headers: {
                "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
            }
        }).then((res) => {
            console.log(res)
            if(res.status == 200){
                setQAId(res.data.QA_id);
                setTitle(res.data.title);
                setContent(res.data.contents);
                setUserName(res.data.userName);
                setPhoneNum(res.data.phoneNum);
                setBoxBtnVisible(!boxbtnvisible);
                SetRejectVisible(!rejectvisible);
            }
        }).catch((event)=>{
            alert("Title or Content is none");
            setQAId("");
            setTitle("");
            setContent("");
            setUserName("");
            setPhoneNum("");
        })
    }

    // Click Reject Button 
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

    // Click Complete Button
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
            <nav className = {style.Nav}>
                <p><b>TAS</b> ADMIN</p>
                <Button className = {style.info} colorScheme='blue' onClick={onOpen}>
                    <FontAwesomeIcon className={style.infoImg} icon = {faCircleUser} />
                </Button>
            </nav>
            {startvisible && <Button className = {style.CreateBtn} colorScheme = "yellow" onClick={() => {
                        //onStart();
                        onToggle();
                        setStratVisible(!startvisible);
                        setBarVisible(!barvisible);
                    }}><p>Start a consultation</p></Button>}
                {barvisible && <Progress className = {style.bar} value={80} />}
                {barvisible && <p className = {style.bar_p}>상담완료</p>}
                {barvisible && <Progress className = {style.bar2} colorScheme='red' value={50} />}
                {barvisible && <p className = {style.bar_p}>상담거절</p>}
            <main className = {style.Main}>
                <div className = {style.CreateFade}>
                    <Fade className = {style.Fade} in={isOpen2}>
                        <Box className = {style.Box} width='100%' height='100%' color='black' mt='0' bg='white' rounded='md' shadow='md'>
                            <div className = {style.Boxblock}>
                                <div>Name:  {userName}</div>
                                <div>PhoneNumber:  {phoneNum}</div>
                                <div className = {style.FormControlArea}>
                                    <FormControl className={style.FormControl} height="100%">
                                        <FormLabel htmlFor='title'>Title</FormLabel>
                                            <Input borderColor="dark" value={title} type='email' />
                                        <div className = {style.FormContent}>
                                            <FormLabel htmlFor='content'>Content</FormLabel>
                                            <Textarea borderColor="black" height="80%" value={content}/>
                                        </div>
                                    </FormControl>
                                </div>
                                {closevisile && <Button className = {style.closeBtn} colorScheme='white;'
                                onClick={() => {
                                    onToggle();
                                    setStratVisible(!startvisible);
                                    setBarVisible(!barvisible);
                                    }}>
                                    <FontAwesomeIcon className = {style.closefont} icon = {faSquareXmark} />
                                </Button>}
                            </div>
                            <div className = {style.BoxBtnArea}>
                                <div className = {style.BoxBtnArea1}>
                                    {boxbtnvisible && <Button className = {style.BoxBtn} colorScheme='whatsapp'
                                    onClick = {() => {
                                        SetCompleteVisible(!completevisible)
                                        setBoxBtnVisible(!boxbtnvisible)
                                    }}
                                    >
                                        상담시작</Button>}
                                    {boxbtnvisible && <Button className = {style.BoxBtn} colorScheme='orange'
                                        onClick = {() => {
                                        onReject()
                                        resetContents()
                                        SetRejectVisible(!rejectvisible)
                                        setBoxBtnVisible(!boxbtnvisible)
                                    }}
                                    >상담거절</Button>}
                                </div>
                                <div className = {style.BoxBtnArea2}>
                                    {}
                                    {completevisible && <Button className = {style.BoxBtnComplete} colorScheme='whatsapp'
                                    onClick = {() => {
                                        onComplete()
                                        resetContents()
                                        SetRejectVisible(!rejectvisible)
                                        SetCompleteVisible(!completevisible)
                                    }}
                                    >상담완료</Button>}
                                    {rejectvisible && <Button className = {style.BoxBtnNext} colorScheme='linkedin'
                                    onClick = {() => {
                                        onStart()
                                    }}
                                    >상담 가져오기</Button>}
                                </div>
                            </div>
                        </Box>
                    </Fade>
                </div>
            </main>
            <Drawer onClose={onClose} isOpen={isOpen1}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader className = {style.DrawerHeader} borderBottomWidth='1px'>상담원: {managerName}</DrawerHeader>
                    <DrawerBody className = {style.DrawerBody}>
                        <div className={style.AdminImg}>
                            <FontAwesomeIcon className = {style.AdimgImgI} icon = {faContactCard}/>
                        </div>
                        <div className={style.AdminInfo}>
                            {/* <p>{managerName}, {position}, {department}</p> */}
                            <ol className = {style.ol}>
                                <li>Position : {position}</li>
                                <li>Department : {department}</li>
                            </ol>
                            <p>완료횟수 : 8</p>
                            <Progress className = {style.bar3} colorScheme='blue' value={80} />
                            <p>거절횟수 : 5</p>
                            <Progress className = {style.bar3} colorScheme='red' value={50} />
                        </div>
                    <Button className = {style.Logout}><a href = "http://localhost:3000/managerlogin">
                        <FontAwesomeIcon className = {style.LogoutI} icon={faRightFromBracket}/></a></Button>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
export default Admin;