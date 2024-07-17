
from typing import Optional 
from pydantic import BaseModel , Field

class Notes(BaseModel):
    title: str
    description: str

class Usersdata(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


