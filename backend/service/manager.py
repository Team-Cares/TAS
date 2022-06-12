from config.db import db
from fastapi import status

# HTTP_status_code  
# 200 => ok                    (상담 완료)
# 202 => Accepted              (상담 수락)
# 503 => Service Unavailable   (거절)
# 

# waiting, complete, proccesing, reject, accept

def getQAdata():
    qaData = db['QA'].find_one({"status":"Waiting"},{"_id":0})
    if qaData is not None:
        print(qaData['QA_id'])
        db['QA'].update_one({"QA_id":qaData['QA_id']},{"$set":{"status":"Processing"}})
        sendData = {
            "QA_id": qaData['QA_id'],
            "title": qaData['title'],
            "contents": qaData['contents'],
            "userName": qaData['user']['name'],
            "phoneNum": qaData['user']['phone_num']
        }
        return sendData
    else:
        return None

def completeQAdata(QA_id:str):
    result = db['QA'].update_one({"QA_id":QA_id},{"$set":{"status":"Complete"}})
    if result.modified_count == 1:
        return status.HTTP_200_OK
    else:
        return status.HTTP_404_NOT_FOUND

def rejectQAdata(QA_id:str):
    result = db['QA'].update_one({"QA_id":str(QA_id)},{"$set":{"status":"Reject"}})
    if result.modified_count == 1:
        return status.HTTP_503_SERVICE_UNAVAILABLE
    else:
        return status.HTTP_404_NOT_FOUND

# def acceptQAdata(QA_id:str):
#     result = db['QA'].update_one({"QA_id":str(QA_id)},{"$set":{"status":"accepte"}})
#     if result.modified_count == 1:
#         return status.HTTP_202_ACCEPTED
#     else:
#         return status.HTTP_404_NOT_FOUND
