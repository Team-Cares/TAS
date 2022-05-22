from fastapi import FastAPI
from router import mainview, login

app = FastAPI()

app.include_router(mainview.router)
app.include_router(login.router)