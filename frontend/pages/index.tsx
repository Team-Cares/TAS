import type { NextPage } from 'next'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Button,
    Input,
    InputGroup,
    InputLeftAddon,
    PinInput,
    PinInputField,
} from '@chakra-ui/react';


const Home: NextPage = () => {
    let [Name, setName] = useState("");
    let [PhoneNumber, setPhoneNumber] = useState("");
    let [Code, setCode] = useState("");

    const submitHandler = (event) => {
        event.preventDefault();
        console.log(body);
    }

    function Click_LogIn(){
      let userN = userName.value;
      let userP = userPhone.value;
      Name = userN;
      PhoneNumber = userP;
      let data = {
        name: String(Name),
        phone_num: String(PhoneNumber)
      };
      let link = "http://127.0.0.1:8000/login";
      axios.post(link, data).then((res) => console.log(res))
      return(
          code.style.display = "block",
          console.log(data),
          setName(Name),
          setPhoneNumber(PhoneNumber),
      );
  }

    let body = {
        Name : Name,
        PhoneNumber : PhoneNumber
    };

    /*axios.post('/client', body).then(function (response) {
        console.log("서버로 전송 성공")      
    })
    .catch(function (error) {
        console.log("서버 전송 실패");
    });

    axios.get('/client').then(function (response) {
        console.log("서버에서 받아오기 성공")      
    })
    .catch(function (error) {
        console.log("서버에서 받아오기 실패");
    });*/

    const Click_Pin = () => {
        let pinArray = [];
        let pinNumber;
        //window.location.assign('/main');
        for(let i=0; i<6; i++){
            pinArray.push(code.children[i].value);
        }
        pinNumber = pinArray.reduce((accumulator, currentNumber) => accumulator + currentNumber);
        Code=pinNumber;
        let data = {
          name: Name,
          phone_num: PhoneNumber
        }
        let Pin = Number(Code)
        let link = "http://127.0.0.1:8000/auth/" + String(Pin);
        axios.post(link, data).then((res) => console.log(res))
        setCode(Code);
        console.log(pinNumber);
    }

    const CodeSubmitHandler = (event) => {
        event.preventDefault();
        console.log(Code);
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <label>Name</label>
                  <Input id='userName'></Input>
                <label>PhoneNumber</label>
                  <InputGroup>
                  <InputLeftAddon children='+82' />
                      <Input id='userPhone' type='tel' placeholder='phone number' />
                  </InputGroup>
                <Button  colorScheme='blue' onClick = {Click_LogIn}>Login</Button>
            </form>
            <form onSubmit = {CodeSubmitHandler} id = "code" style = {{display: "none"}}>
                        <PinInput>
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                            <PinInputField />
                        </PinInput>
                <Button colorScheme='blue' id = "btn" onClick = {Click_Pin}>확인</Button>
            </form>
        </div>
    )
}

export default Home;