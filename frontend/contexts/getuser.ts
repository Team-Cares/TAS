import axios from "axios";
import React, {useEffect} from 'react';
import {
    atom, selector, useRecoilValue
} from "recoil";


const getuserUrl = "http://127.0.0.1:8000/login/user/";

export const getUserInfo = async () => {
    if (typeof window !== "undefined") {
        const userId = window.localStorage.getItem("userID");
        const response = await axios.get(getuserUrl + String(userId)).then((res) => {
            return res.data;
            //return res.data
        });
        //console.log(response.then(data => data._id));
        return response.userDetails;
    }
};

// export const currentUserQuery = selector({
//     key: 'CurrentUser',
//     get: async () => {
//         if (typeof window !== "undefined") {
//             const userId = window.localStorage.getItem("userID");
//             const response = axios.get(getuserUrl + userId).then((res) => (
//                 res.data
//             ))
//         return response}},
// });
// import axios from "axios";
// import {
//     atom, selector, useRecoilValue
// } from "recoil";

// const getuserUrl = "http://127.0.0.1:8000/login/user/";

// export const currentUserIDState = atom({
//     key: 'CurrentUserID',
//     default: "",
// });

// export const getIsLogin = selector({
//     key: 'IsLogin',
//     get: ({get}) => {
//         return get(currentUserIDState) !== ""
//     }
// })
  
// export const currentUserQuery = selector({
//     key: 'CurrentUser',
//     get: async ({get}) => {
//         const response = axios.get(getuserUrl + get(currentUserIDState)).then((res) => (
//             res.data
//         ))
//         return response},
//   });