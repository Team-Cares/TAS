import React, { useState } from 'react';
import axios from 'axios';

function Hidden(){
    return(
        code.style.display = "block"
    );
}
const Client_login: React.FC = () => {
    const [Name, setName] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");
    const [Code, setCode] = useState("");
    
    const NameHandler = (event) => {
        event.preventDefault();
        setName(event.target.value);
    }

    const PhoneNumberHandler = (event) => {
        event.preventDefault();
        setPhoneNumber(event.target.value);
    }
    const submitHandler = (event) => {
        event.preventDefault();
        console.log(body);
    }

    let body = {
        Name : Name,
        PhoneNumber : PhoneNumber
    };
    axios.post('/client', body).then(function (response) {
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
    });

    const CodeHandler = (event) => {
        event.preventDefault();
        setCode(event.target.value);
    }

    const CodeSubmitHandler = (event) => {
        event.preventDefault();
        console.log(Code);
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <p><label>Name</label>
                <input type="name" value={Name} onChange={NameHandler}></input></p>
                <p><label>PhoneNumber</label>
                <input type="phonenumber" value={PhoneNumber} onChange={PhoneNumberHandler}></input></p>
                <button type="submit" onClick = {Hidden}>Login</button>
            </form>
            <form onSubmit = {CodeSubmitHandler} id = "code" style = {{display: "none"}}>
                    <p><input type = "text" placeholder = '인증번호' value = {Code} onChange={CodeHandler}/></p>
                    <p><a href = 'http://localhost:3000/main'><button type="submit">확인</button></a></p>
            </form>
        </div>
    )
}

export default Client_login;