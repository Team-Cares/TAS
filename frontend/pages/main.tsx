import React, { useState } from 'react';
import type { NextPage } from 'next'
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

interface Topic {
  id: number;
  title: string;
  contents: string;
}

const Main: NextPage = () => {
  const [id, setId] = React.useState(3)
  const [topics, setTopics] = React.useState<Array<Topic>>([{
    id: 0,
    title: "상담1",
    contents: "상담1 내용"
  },{
    id: 1,
    title: "상담2",
    contents: "상담2 내용"
  },{
    id: 2,
    title: "상담3",
    contents: "상담3 내용"
  }])
  const [title, setTitle] = React.useState("")
  const [contents, setContents] = React.useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [mode, setMode] = React.useState("Create")

  const handleTitle: React.ChangeEventHandler<HTMLInputElement> = (event) => setTitle(event.target.value)
  const handleContents: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => setContents(event.target.value)


  //상담 내용을 추가하는 함수
  const addTopics = () => {
    const topic: Topic = {
      id: id,
      title,
      contents
    }
    setId((id) => id + 1);
    setTopics((topics) => ([...topics, topic]));
    setTitle("")
    setContents("")
    onClose();
  }
  //수정버튼을 눌렀을때 기존의 제목과 내용을 가져오는 함수
  const reOpen = (topic) =>{
    setId(topic.id);
    setTitle(topic.title);
    setContents(topic.contents);
  }
  //기존의 내용을 수정시키는 함수
  const updateTopics = () => {
    const newTopics = [...topics]
    const updateTopics = {id, title, contents}
    for(let i=0; i<topics.length; i++){
      if(newTopics[i].id === id){
        newTopics[i] = updateTopics;
        break;
      }
    }
    setTopics(newTopics);
    onClose();
  }
  //삭제 함수
  const deletetopics = (topic) =>{
    const newDeleteTopics = [];
    for(let i=0; i<topics.length; i++){
      if(topics[i].id !== topic.id){
        newDeleteTopics.push(topics[i]);
      }
    }
    setTopics(newDeleteTopics);
  }

  let content = null;
  if(mode === "Create"){
    content = <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>상담 생성</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input value={title} onChange={handleTitle}/>
        <Textarea value={contents} onChange={handleContents}/>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={addTopics}>
          추가
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  }else if(mode === "Update"){
    content = <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>상담 수정</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Input value={title} onChange={handleTitle}/>
        <Textarea value={contents} onChange={handleContents}/>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme='blue' mr={3} onClick={updateTopics}>
          수정
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  }
  //메인 코드
  return (
    <div className = {style.mainbody}>
      <div className = {style.maincontent}>
        <Accordion className = {style.Accordion}>
          <AccordionItem className = {style.create}>
            <AccordionButton onClick={(event)=>{
              event.preventDefault();
              onOpen();
              setMode("Create");
            }}>
              <FontAwesomeIcon icon={faCirclePlus} className = {style.createbtn}/>
            </AccordionButton>
          </AccordionItem>
          {topics.map((topic) => (
            <AccordionItem key={topic.id}>
              <AccordionButton className = {style.titleBtn}>
                {topic.title}
              </AccordionButton>
              <div className = {style.contentlist}>
              <AccordionPanel className = {style.AccordionPanel}>
                {topic.contents}
                  <Button className = {style.btn} colorScheme='#ffab00;' mr={3} onClick={(event)=>{
                    event.preventDefault();
                    onOpen();
                    reOpen(topic);
                    setMode("Update");
                  }}>
                    <FontAwesomeIcon icon={faHighlighter} />
                  </Button>
                  <Button className = {style.btn} colorScheme='#ffab00;' mr={3} onClick={(event)=>{
                    event.preventDefault();
                    deletetopics(topic);
                    console.log(topics);
                  }}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
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

export default Main;