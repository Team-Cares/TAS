from datetime import datetime
from uuid import uuid4, UUID
from bson import ObjectId
from fastapi.responses import JSONResponse
from fastapi import APIRouter, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import Union
from models.model import QA
from config.db import db

router = APIRouter()

@router.get("/user/{userid}",tags=["QA"])
async def getCounsel(userid:str):
    user = db['user'].find_one({"_id":ObjectId(userid)},{"_id":0})
    if user is not None:
        datas = []
        for data in db['QA'].find({},{"_id":0}):
            a = data['user']
            if a['phone_num'] == user['phone_num']:
                datas.append(data)
        print(datas)
        return JSONResponse(content=jsonable_encoder(datas), status_code=status.HTTP_200_OK)
    raise HTTPException(status_code=404, detail=f"user {userid} not found")

@router.post("/user/create",tags=["QA"], response_model=QA)
async def createCounsel(req:QA):
    data = req.dict()
    data['QA_id'] = uuid4()
    data["created_at"] = datetime.now()
    data["updated_at"] = data["created_at"]
    data['status'] = "wait"
    db['QA'].insert_one(jsonable_encoder(data))
    created_QA = db['QA'].find_one({"QA_id":str(data['QA_id'])},{"_id":0})
    print(created_QA)
    return JSONResponse(content=jsonable_encoder(created_QA), status_code=status.HTTP_201_CREATED)

@router.put("/user/{QA_id}",tags=["QA"])
async def updateCounsel(QA_id:str, req:QA):
    data = req.dict()
    if data:
        data['updated_at'] = datetime.now()
        data['QA_id'] = str(data["QA_id"])
        result = db['QA'].update_one({"QA_id":QA_id},{"$set":data})
        print(result.modified_count)
        if result.modified_count == 1:
            if (update_QA := db['QA'].find_one({"QA_id":QA_id},{"_id":0})) is not None:
                return JSONResponse(content=jsonable_encoder(update_QA), status_code=status.HTTP_200_OK)
    else:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)
    raise HTTPException(status_code=404, detail=f"QA {QA_id} not found")

@router.delete("/user/{QA_id}",tags=["QA"])
def deleteCounsel(QA_id:str):
    delete_result = db['QA'].delete_one({"QA_id":QA_id})
    print(delete_result.deleted_count)
    if delete_result.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_205_RESET_CONTENT)
    else:
        raise HTTPException(status_code=404, detail=f"QA {QA_id} not found")