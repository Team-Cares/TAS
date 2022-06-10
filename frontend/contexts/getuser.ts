import axios from "axios";
import React from 'react';

const getuserUrl = "http://127.0.0.1:8000/login/user/";
  
export const getUserInfo = () => {
    let userId = ""
    React.useEffect(() => {
        userId = String(window.localStorage.getItem("userID"));
    });
    const response = axios.get(getuserUrl + String(userId)).then((res) => (
        res.data
    ))
    console.log(response);
    return response
};