from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

from service.manager import completeQAdata, getQAdata, rejectQAdata, getGeneralM
router = APIRouter()


# 관리자 메인 뷰에서는 상담 내용 보여줘야 함
# 거절, 수락, 완료, next 버튼 있으니 요청을 받아야 함
# 상담 할 때, 상담 내용?을 적는 칸이 있음 해당 정보까지 받아야함
# 
router.get("/manager/{position}/{M_id}",tags=["manager"])
def managerDataGet(position:str, M_id:str):
    if position == "상담사":
        # 상담사 정보 및 상담 내용 queue Get
        return 
    else:
        # 총괄 정보 및 상담 데이터 비율 queue Get
        return 

# 미완성
router.post("/manager/{position}/{M_id}",tags=["manager"])
def managerPostData(M_id:str, position:str, req: Request):
    if req.client.status == 200:
        # 상담사가 상담 완료 했을 경우
        result = completeQAdata(req.QA_id)
        return JSONResponse(status_code = result)
    elif req.client.status == 202:
        # 상담사가 상담 수락 했을 경우
        result = getQAdata()
        return JSONResponse(content = result, status_code = status.HTTP_200_OK)
    else:
        # 상담사가 상담 거절했을 경우
        result = rejectQAdata(req.QA_id)
        return JSONResponse(status_code=result)
