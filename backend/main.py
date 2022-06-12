from fastapi import FastAPI
from router import mainview, login, managerview, managerLogin
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mainview.router)
app.include_router(login.router)
app.include_router(managerview.router)
app.include_router(managerLogin.router)