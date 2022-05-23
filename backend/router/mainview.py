from cgitb import reset
from datetime import datetime
from uuid import UUID, uuid4
from bson import ObjectId
from bson.binary import Binary, UuidRepresentation
from pytz import timezone
from fastapi.responses import JSONResponse
from fastapi import APIRouter, HTTPException, status
from fastapi.encoders import jsonable_encoder
from models.model import QA,User
from config.db import db

router = APIRouter()

@router.get("/user/{userid}",tags=["QA"])
async def getCounsel(userid:str):
    if user := db['user'].find_one({"_id":ObjectId(userid)}) is not None:
        datas = []
        for data in db['QA'].find():
            a = data['user']
            if a['phone_num'] == user['phone_num']:
                data['_id'] = str(data['_id'])
                datas.append(data)
        print(datas)
        return JSONResponse(content=jsonable_encoder(datas), status_code=status.HTTP_200_OK)
    raise HTTPException(status_code=404, detail=f"user {userid} not found")

@router.post("/user/create",tags=["QA"], response_model=QA)
async def createCounsel(req:QA):
    data = req.dict()
    data['QA_id'] = uuid4()
    data["create_at"] = datetime.now(timezone('Asia/Seoul'))
    QA_data = db['QA'].insert_one(jsonable_encoder(data))
    created_QA = db['QA'].find_one({"_id":QA_data.inserted_id})
    created_QA['_id'] = str(created_QA['_id'])
    print(created_QA)
    return JSONResponse(content=jsonable_encoder(created_QA), status_code=status.HTTP_201_CREATED)

@router.put("/user/{id}",tags=["QA"])
async def updateCounsel(id:str, req:QA):
    data = req.dict()
    if data:
        result = db['QA'].update_one({"_id":ObjectId(id)},{"$set":data})
        if result.modified_count == 1:
            if (update_QA := db['QA'].find_one({"_id":ObjectId(id)})) is not None:
                update_QA['_id'] = str(update_QA['_id'])
                return JSONResponse(content=jsonable_encoder(update_QA), status_code=status.HTTP_200_OK)
    else:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)
    raise HTTPException(status_code=404, detail=f"QA {id} not found")
    
@router.delete("/user/{id}",tags=["QA"])
def deleteCounsel(id:str):
    print(id)
    print(type(id))
    delete_result = db['QA'].delete_one({"_id":ObjectId(id)})
    print(delete_result.deleted_count)
    if delete_result.deleted_count == 1:
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)
    else:
        raise HTTPException(status_code=404, detail=f"QA {id} not found")