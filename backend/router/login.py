from bson import ObjectId
from fastapi import APIRouter, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from models.model import User
from config.db import db
import random

router = APIRouter()

@router.get('/login/user/{userid}', tags=["users"])
async def getUser(userid:str):
    if ObjectId.is_valid(userid):
        if (data := db["user"].find_one({"_id":ObjectId(userid)})) is not None:
            data['_id'] = str(data['_id'])
            return JSONResponse(content=jsonable_encoder(data), status_code=status.HTTP_200_OK)
        raise HTTPException(status_code=404, detail=f"user {userid} not found")
    else:
        raise HTTPException(status_code=404, detail=f"{userid} is not a valid ObjectId")
    

# 고민을 해볼 필요가 있다 수정 필요
@router.post('/login', tags=["users"])
async def post_info(req:User):
    user = req.dict()
    if user["random_num"]:
        data = db["user"].find_one({"phone_num":user["phone_num"]})
        if data["random_num"] == int(user["random_num"]):  # 인증 성공
            data['_id'] = str(data['_id'])
            return JSONResponse(content=jsonable_encoder(data), status_code=status.HTTP_200_OK)
        else:
            raise HTTPException(status_code=404, detail=" The authentication values don't match")
    else:
        randoms = str(random.randrange(1,9))
        for i in range(5):
            randoms += str(random.randrange(0,9))
        user["random_num"] = int(randoms)
        print(user)
        db["user"].insert_one(jsonable_encoder(user))
        
        return JSONResponse(status_code=status.HTTP_200_OK)
