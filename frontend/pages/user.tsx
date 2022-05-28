import React, { useState } from 'react';
import type { NextPage } from 'next'
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
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentUserIDState, currentUserQuery } from '../contexts/user';

interface Topic {
  id: number;
  title: string;
  contents: string;
}

const User: NextPage = () => {
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
  const user = useRecoilValue(currentUserQuery)

  const handleTitle: React.ChangeEventHandler<HTMLInputElement> = (event) => setTitle(event.target.value)
  const handleContents: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => setContents(event.target.value)

  React.useEffect(() => {
    console.log(user)
  }, [])

  
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

  const reOpen = (topic: Topic) =>{
    setId(topic.id);
    setTitle(topic.title);
    setContents(topic.contents);
  }

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

  const deletetopics = (topic: Topic) =>{
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
    content = <Modal isOpen={isOpen} onClose={onClose}>
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
        <Button colorScheme='blue' mr={3} onClick={updateTopics}>
          수정
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  }

  return (
    <div>
      <Accordion>
        <AccordionItem>
          <AccordionButton onClick={onOpen}>
            📑
          </AccordionButton>
        </AccordionItem>
        {topics.map((topic) => (
          <AccordionItem key={topic.id}>
            <AccordionButton>
              {topic.title}
            </AccordionButton>
            <AccordionPanel>
              {topic.contents}
              <Button colorScheme='purple' mr={3} onClick={(event)=>{
                event.preventDefault();
                onOpen();
                reOpen(topic);
                setMode("Update");
              }}>
                수정
              </Button>
              <Button colorScheme='blue' mr={3} onClick={(event)=>{
                event.preventDefault();
                deletetopics(topic);
                console.log(topics);
              }}>
                삭제  
              </Button>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {content}
    </div>
  )
}

export default User;