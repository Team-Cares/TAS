import boto3
import os
from dotenv import load_dotenv

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