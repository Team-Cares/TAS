from fastapi import APIRouter
from fastapi.encoders import jsonable_encoder
from models.model import User, QA
from config.db import db
import random

router = APIRouter()


# 고민을 해볼 필요가 있다 수정 필요
@router.post('/login', tags=["users"])
async def post_info(req:User):
    user = req.dict()
    if user["random_num"]:
        data = db["user"].find_one({"phone_num":user["phone_num"]})
        if data["random_num"] == int(user["random_num"]):
            return jsonable_encoder(user)
        else:
            return "인증 실패"
    else:
        randoms = str(random.randrange(1,9))
        for i in range(5):
            randoms += str(random.randrange(0,9))
        user["random_num"] = int(randoms)
        print(user)
        db["user"].insert_one(jsonable_encoder(user))
        
        return user
