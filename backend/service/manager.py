from config.db import db
from fastapi import status

# HTTP_status_code  
# 200 => ok                    (상담 완료)
# 202 => Accepted              (상담 수락)
# 503 => Service Unavailable   (거절)
# 

# waiting, complete, proccesing, reject


def completeQAdata(QA_id:str):
    result = db['QA'].update_one({"QA_id":str('QA_id')},{"status":"complete"})
    if result.modified_count == 1:
        return status.HTTP_200_OK
    else:
        return status.HTTP_404_NOT_FOUND

def getQAdata():
    qaData = db['QA'].find_one({"status":"wait"},{"_id":0})
    db['QA'].update_one({"QA_id":str(qaData['QA_id'])},{"status":"proccesing"})
    qaData['status'] = "processing"
    
    return qaData

def rejectQAdata(QA_id:str):
    result = db['QA'].update_one({"QA_id":str(QA_id)},{"status":"reject"})
    if result.modified_count == 1:
        return status.HTTP_503_SERVICE_UNAVAILABLE
    else:
        return status.HTTP_404_NOT_FOUND
    
def getGeneralM():
    pass