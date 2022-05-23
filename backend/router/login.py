from bson import ObjectId
from fastapi import APIRouter, status, HTTPException
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from datetime import datetime, timedelta

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

@router.post('/login', tags=["users"])
async def postUser(req:User):
    user = req.dict()
    result = db["user"].find_one({"phone_num":user["phone_num"]})
    if result is None:
        db["user"].insert_one(jsonable_encoder(user))
    randoms = str(random.randrange(1,9))
    for i in range(5):
        randoms += str(random.randrange(0,9))
    token = dict()    
    token["random_num"] = int(randoms)
    token["created_at"] = datetime.now()
    token["user"] = user
    db["token"].insert_one(jsonable_encoder(token))
    
    return JSONResponse(status_code=status.HTTP_200_OK)

@router.post('/auth', tags=["users"])
async def checkAuth(user:User, token:int):
    datas = db["token"].find({"user":jsonable_encoder(user)},{"_id":0}).sort("created_at")
    data = list(datas)[-1]
    
    if data['random_num'] == token:
        recordTime = str(data['created_at']).replace('T',' ')
        recordTime = datetime.strptime(recordTime,"%Y-%m-%d %H:%M:%S.%f")
        nowTime = datetime.now()
        if nowTime - recordTime < timedelta(minutes=5):
            userDict = user.dict()
            userData = db['user'].find_one({"phone_num":userDict['phone_num']})
            userData['_id'] = str(userData['_id'])
            return JSONResponse(content=jsonable_encoder(userData), status_code=status.HTTP_200_OK)
        else:
            return JSONResponse(status_code=status.HTTP_408_REQUEST_TIMEOUT)
    else:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST)