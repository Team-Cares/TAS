from json import JSONEncoder
from fastapi import APIRouter, status, Request
from fastapi.responses import JSONResponse, Response
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

from uuid import uuid4
from datetime import datetime

from config.db import db
from models.model import Manager

router = APIRouter()

# 참고 링크 : < https://victoria-k.tistory.com/entry/2-Fast-API-Basic-Request-%ED%8E%B8 >

# 관리자 회원가입은 어떻게 할까?
# 1. 총괄 책임자 쪽에서 관리자 생성?
# 2. 아니면 일반 회원가입 처럼 관리자 생성?
# 1번으로 하기로 결정했으니 일단은 상담사는 우리가 미리 데이터를 넣어야 할듯
# 아이디 중복은 안되니까 그걸로 일단 찾자

class ManagerLoginInfo(BaseModel):
    id: str;
    pw: str;

@router.get("/create/manager",tags=["Manager"])
def createManager():
    manager = {
        "M_id": uuid4(),
        "id": "choihs0924",
        "pw": "gudtns0924@",
        "name": "박병근",
        "position": "상담사",
        "department": "한남대 컴퓨터",
        "created_at": datetime.now()
    }
    data = db['manager'].find_one({"id":str(manager["id"])})
    if data is None:
        result = db['manager'].insert_one(jsonable_encoder(manager)).inserted_id
        if result:
            return Response(status_code=status.HTTP_201_CREATED)
        else:
            return Response(status_code=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status_code=status.HTTP_226_IM_USED)
    
    

@router.get("/get/manager/{M_id}",tags=["Manager"])
def getManagerInfo(M_id: str):
    data = db['manager'].find_one({"M_id":M_id})
    if data is not None:
        managerData = {
            "M_id": M_id,
            "name": data['name'],
            "position": data['position'],
            "department": data['department'],
        }
        return JSONResponse(content=jsonable_encoder(managerData), status_code=status.HTTP_200_OK)
    else:
        return Response(status_code=status.HTTP_404_NOT_FOUND)

@router.post("/manager/login",tags=["Manager"])
def managerLogin(req:ManagerLoginInfo):
    id = req.id
    pw = req.pw
    print(id, pw)
    manager = db['manager'].find_one({"id":id})
    if manager is not None:
        if manager['pw'] == pw:
            return JSONResponse(content = manager['M_id'], status_code=status.HTTP_200_OK)
        else:
            return Response(status_code=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    