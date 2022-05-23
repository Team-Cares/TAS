from uuid import UUID
from typing import List, Tuple, Union
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    name: str
    phone_num: str
    random_num: Union[int, None] = None
    
class QA(BaseModel):
    QA_id: Union[UUID, None] = None
    title: str
    contents: str
    status: str
    create_at:  Union[datetime, None] = None
    reservation_at : Union[List[Tuple[datetime,datetime]],None] = None
    user: User