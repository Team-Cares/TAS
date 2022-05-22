from datetime import datetime
from uuid import UUID, uuid4
from pytz import timezone
from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from models.model import QA,User
from config.db import db

router = APIRouter()

@router.get("/user/{phone_num}",tags=["QA"])
async def getCounsel(phone_num:str):
    userinfo = db['User'].find_one({"phone_num":phone_num})
    print(userinfo)
    data = db['QA'].find({"user":userinfo})
    return data

@router.post("/user/create",tags=["QA"])
async def createCounsel(req:QA):
    data = req.dict()
    data["create_at"] = datetime.now(timezone('Asia/Seoul'))
    db['QA'].insert_one(jsonable_encoder(data))
    return 201

@router.put("/user/{id}",tags=["QA"])
async def updateCounsel(id:UUID, req:QA):
    data = req.dict()
    db['QA'].update_one({"QA_id":UUID(id)},{"$set":data})
    return 200
    
@router.delete("/user/{id}",tags=["QA"])
async def deleteCounsel(id:UUID):
    db['QA'].delete_one({"QA_id":UUID(id)})
    return 200