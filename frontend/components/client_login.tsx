import React, { useState } from 'react';
import axios from 'axios';

//사용자 이름, 휴대전화 번호를 입력받은 후 숨겨진 인증코드 창을 띄우게 하는 함수
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

    /* 인증번호 함수*/
    // 인증번호 입력값을 받아오는 함수
    const CodeHandler = (event) => {
        event.preventDefault();
        setCode(event.target.value);
    }
    // 인증번호 입력후 확인버튼을 눌렀을 시 페이지 이동 함수
    const Click = () => {
        window.location.assign('/main');
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
                    <p><button id = "btn" type="submit" >확인</button></p>
            </form>
        </div>
    )
}

export default Client_login;