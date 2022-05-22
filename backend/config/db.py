import os
from dotenv import load_dotenv
from urllib.parse import quote
from pymongo import MongoClient

load_dotenv()
mongoUserName = os.environ.get("MONGOUSER")
mongoPw = os.environ.get("MONGOPW")

MONGOURL = "mongodb+srv://" + mongoUserName +":"+quote(mongoPw)+"@cluster0.lcd2t.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(MONGOURL , serverSelectionTimeoutMS=5000)
db = client["fastapi"]