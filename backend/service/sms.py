from email import message
import boto3
import os
from dotenv import load_dotenv
from config.db import db

load_dotenv()

access_key_id = os.environ.get("AWS_ACCESS_KEY_ID")
secret_access_key = os.environ.get("AWS_SECRET_KEY")

def sendSMS(phoneNum, message):
    client = boto3.client(
        "sns",
        aws_access_key_id = access_key_id,   
        aws_secret_access_key = secret_access_key,    
        region_name="ap-northeast-1"# 도쿄
    )
    phoneNum = "+82" + phoneNum
    message = str(message)
    print(phoneNum, message)
    response = client.publish(
        PhoneNumber=phoneNum,
        Message=message,
    )
    
    return response

def orderMessage(user:dict):
    order = db['QA'].count_documents({"$or": [{"status" : "Waiting"},{"status":"Processing"}]})
    message = "[Web발신]\n[TAS] 상담 접수 완료.\n"
    message += "상담 대기 순서: " + " [" + str(order) + "번]\n상담 대기 예상 시간: " + str((order-1) * 4) + "분"
    print(message)
    #sendSMS(user["phone_num"], message)
