from uuid import UUID
from typing import List, Tuple, Union
from datetime import datetime
from pydantic import BaseModel

class User(BaseModel):
    name: str
    phone_num: str
    
class Token(BaseModel):
    random_num: Union[int, None] = None
    created_at: Union[datetime, None] = None
    user: User
    
class QA(BaseModel):
    QA_id: Union[UUID, None] = None
    title: str
    contents: str
    status: Union[str, None] = None
    created_at: Union[datetime, None] = None
    updated_at: Union[datetime, None] = None
    #reservation_at : Union[List[Tuple[datetime,datetime]],None] = None
    user: User

# class QA(BaseModel):
#     QA_id: Union[UUID, None] = None
#     title: str
#     contents: str
#     status: Union[str, None] = None
#     created_at: Union[datetime, None] = None
#     updated_at: Union[datetime, None] = None
#     user: User
#     manager_id: str 

class QA_update(BaseModel):
    title: str
    contents: str

class Manager(BaseModel):
    M_id: Union[UUID, None] = None
    id: str
    pw: str
    name: str
    position: str
    department: str
    created_at: Union[datetime, None] = None
    

    