from fastapi import APIRouter

router = APIRouter()


# 관리자 메인 뷰에서는 상담 내용 보여줘야 함
# 거절, 수락, 완료, next 버튼 있으니 요청을 받아야 함
# 상담 할 때, 상담 내용?을 적는 칸이 있음 해당 정보까지 받아야함
# 
router.get("/manager/{M_id}",tags=["manager"])
def managerDataGet(M_id:str):
    
    
    pass