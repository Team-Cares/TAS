import axios from "axios";
import {
    atom, selector, useRecoilValue
} from "recoil";

const getManagerUrl = "http://127.0.0.1:8000/get/manager/";

export const currentManagerIDState = atom({
    key: 'CurrentManagerID',
    default: "",
});

export const getIsLogin = selector({
    key: 'IsLogin',
    get: ({get}) => {
        return get(currentManagerIDState) !== ""
    }
})
  
export const currentManagerQuery = selector({
    key: 'CurrentManager',
    get: async ({get}) => {
      const response = axios.get(getManagerUrl + get(currentManagerIDState)).then((res) => (
          res.data
      ))
      return response
    },
  });