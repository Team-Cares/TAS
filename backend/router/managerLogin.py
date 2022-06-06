from json import JSONEncoder
from fastapi import APIRouter, status, Request
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from config.db import db
from models.model import Manager

router = APIRouter()

# 참고 링크 : < https://victoria-k.tistory.com/entry/2-Fast-API-Basic-Request-%ED%8E%B8 >

# 관리자 회원가입은 어떻게 할까?
# 1. 총괄 책임자 쪽에서 관리자 생성?
# 2. 아니면 일반 회원가입 처럼 관리자 생성?
# 1번으로 하기로 결정했으니 일단은 상담사는 우리가 미리 데이터를 넣어야 할듯
# 아이디 중복은 안되니까 그걸로 일단 찾자

router.post("/manager/login")
def managerLogin(req:Request):
    id = req.client.id 
    pw = req.client.pw
    manager = db['manager'].find_one({"id":id})
    
    if manager is not None:
        if manager['pw'] == pw:
            data = {
                "M_id": manager['M_id'],
                "name": manager['name'],
                "position": manager['position'],
                "department": manager['department']
            }
            return JSONResponse(contents = jsonable_encoder(data), status_code=status.HTTP_200_OK)
        else:
            return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST)
    else:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND)
    