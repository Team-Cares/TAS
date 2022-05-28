import axios from "axios";
import {
    atom, selector, useRecoilValue
} from "recoil";

const getuserUrl = "http://127.0.0.1:8000/login/user/";

export const currentUserIDState = atom({
    key: 'CurrentUserID',
    default: "",
});

export const getIsLogin = selector({
    key: 'IsLogin',
    get: ({get}) => {
        return get(currentUserIDState) !== ""
    }
})
  
export const currentUserQuery = selector({
    key: 'CurrentUser',
    get: async ({get}) => {
      const response = axios.get(getuserUrl + get(currentUserIDState)).then((res) => (
          res.data
      ))
      return response
    },
  });