import React, { useState } from 'react';
import type { NextPage } from 'next'
import axios from 'axios';
import style from '../styles/User.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faHighlighter, faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure
} from '@chakra-ui/react';
//import { constSelector, useRecoilState, useRecoilValue } from 'recoil';
//import { currentUserIDState, currentUserQuery } from '../contexts/user';
//import { currentUserQuery } from '../contexts/getuser';
//import { getUserInfo } from '../contexts/getuser';
// import { Server } from 'http';
// import { create } from 'domain';

interface QaData {
  QA_id: string;
  title: string;
  contents: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    phone_num: string;
  }
  id: number;
}

const User: NextPage = () => {

  const getUserId = () => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("userID");
    }
  }

  const [ userToken ] = useState(getUserId);
  const [userName, setUserName] = React.useState("");
  const [userPhone, setUserPhone] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [contents, setContents] = React.useState("");
  const [mode, setMode] = React.useState("Create");
  const [QaDatas, setQaDatas] = React.useState<Array<QaData>>([]);
  const [targetID, setTargetID] = React.useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDelete, setDelete] = useState(false);
  const [isUpdate, setUpdate] = useState(false);
  const tmpQaDatas : any[] = [];

  const handleTitle: React.ChangeEventHandler<HTMLInputElement> = (event) => setTitle(event.target.value)
  const handleContents: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => setContents(event.target.value)
  
  const ServerUrl = 'http://127.0.0.1:8000/user/';
  

  React.useEffect(() => {
    getUserInfo();
    PullData();
  }, [userName,userPhone])
  // Originally Pulling data from DB
  // And then, saved data called "QaDatas"

  //Set disabled Status
  const setDisabledButton = (status:String) =>{
    if (status == "waiting"){
        setDelete(false);
        setUpdate(false);
    }
    else if(status == "processing"){
        setDelete(true);
        setUpdate(true);
    }
    else{
      setDelete(false);
      setUpdate(true);
    }
  }

  //Get User infomation 
  const getUserInfo = async () => {
  const getuserUrl = "http://127.0.0.1:8000/login/user/";
  axios.get(getuserUrl + userToken,{
    headers: {
      "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
    }
  }).then((res) => {
      setUserName(res.data.name);
      setUserPhone(res.data.phone_num);

  });
  }

  //Get QA Data List
  const PullData = () => {
    axios.get(ServerUrl+userToken,{
      headers: {
        "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
      }
    }).then((res) => {
        console.log(res)
        for(let i=0; i<res.data.length; i++){
          tmpQaDatas.push(res.data[i]);
        }
        setQaDatas(tmpQaDatas);
      }
    )
  }

  //Set QA Status Color
  const Color = (statusCode:string) => {
    if (statusCode==="Waiting"){return "yellow"}
    else if(statusCode==="Reject"){return "red"}
    else if(statusCode==="Complete"){return "green"}
    else{return "blue"}
  }

  // Create Item
  const addTopics = async () => {
    const CreateUrl = ServerUrl + "create";
    const data = {
      title,
      contents,
      user: {
        name : userName,
        phone_num : userPhone
      }
    }
    await axios.post(CreateUrl, data, {
      headers: {
          "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
      }
    }).then((res) => {
      if (res.status == 201){
        setTitle("");
        setContents("");
        PullData();//Ready to Read Item
        onClose();
      }else if(res.status == 204){
        alert("제목 혹은 내용을 입력해주세요.")
      }
    })
  }

  // Update Item
  const updateTopics = (target_id: String) => {
    const newTopics = [...QaDatas]
    setQaDatas(newTopics);
    
    const data = {
      QA_id: target_id,
      title,
      contents,
    }
    
    let updateurl = ServerUrl + String(target_id);
    axios.put(updateurl, data, {
      headers: {
        "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
      }
    }).then((res) => {
      console.log(res);
      PullData();//Ready to Read Item
    })
    onClose();
    
    // Setting empty variable & Ready to Create mode
    setTitle("");
    setContents("");
    setMode("Create");
  }
  
  // Delete Item
  const deletetopics = (target_id:string) => {
    let url = ServerUrl + String(target_id);
    axios.delete(url, {
      headers:{
        "Access-Control-Allow-Origin": "http://127.0.0.1:3000"
      }
    }).then((res) => {
      console.log(res);
      PullData();//Ready to Read Item
    })
  }

  // Targeting Data and ready to open modal
  const reOpen = (topic: QaData) =>{
    setTargetID(topic.QA_id);
    setTitle(topic.title);
    setContents(topic.contents);
  }
  
  // Process Mode change parts


  let content = null;
  if(mode === "Create"){
    content = <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>상담 생성</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <div style={{fontWeight: 'bold'}}>Title</div>
        <Input style={{borderColor: 'gray'}} value={title} onChange={handleTitle}/>
        <div style={{fontWeight: 'bold', marginTop: '2%'}}>Contents</div>
        <Textarea style={{borderColor: 'gray'}} value={contents} onChange={handleContents}/>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={addTopics}>
          추가
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  }else if(mode === "Update"){
    content = <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>상담 수정</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input value={title} onChange={handleTitle}/>
        <Textarea value={contents} onChange={handleContents}/>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={()=>{updateTopics(targetID)}}>
          수정
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  }

  // rendering elements
  return (
    <div className = {style.mainbody}>
      <div className = {style.maincontent}>
        <Accordion className = {style.Accordion} allowToggle>
          <AccordionItem className = {style.create}>
            <AccordionButton onClick={(event)=>{
              event.preventDefault();
              onOpen();
              setMode("Create");
            }}>
              <FontAwesomeIcon icon={faCirclePlus} className = {style.createbtn}/>
            </AccordionButton>
          </AccordionItem>
          {QaDatas.map((Qadata) => (
            <AccordionItem key={Qadata.QA_id}>
                <AccordionButton data-toggle="collapse" className = {style.titleBtn} onClick={(event) =>{setDisabledButton(Qadata.status)}}>
                  <p className = {style.QadataTitle}>{Qadata.title}</p>
                  <Button className = {style.statusBtn} colorScheme={Color(Qadata.status)}>{Qadata.status}</Button>
                </AccordionButton>
              <div className = {style.contentlist}>
              <AccordionPanel style={{ marginTop: '1%'}} className = {style.AccordionPanel}>
                <div className = {style.conArea}>
                  <div className = {style.textArea}>
                    {Qadata.contents}
                  </div>
                  <div className = {style.btnArea}>
                    <Button className = {style.btn} colorScheme='#0841D8;' mr={3} disabled={isUpdate} onClick={(event)=>{
                      event.preventDefault();
                      onOpen();
                      reOpen(Qadata);
                      setMode("Update");
                    }}>
                      <FontAwesomeIcon icon={faHighlighter} />
                    </Button>
                    <Button className = {style.btn} colorScheme='#893DBA;' mr={3} disabled={isDelete} onClick={(event)=>{
                      event.preventDefault();
                      deletetopics(Qadata.QA_id);
                    }}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
              </AccordionPanel>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
        {content}
      </div>
    </div>
  )
}

export default User;