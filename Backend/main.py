
from fastapi import FastAPI, HTTPException ,Depends ,status
from model import Notes ,Usersdata 
from bson import ObjectId
from newbase import (
    fetch_one_note,
    fetch_all_notes,
    create_notes,
    update_notes,
    remove_notes,
    create_user,
    get_user_by_email,
    collection,
    fetch_notes_by_user,
)
from fastapi.middleware.cors import CORSMiddleware
##########################################################################
from pydantic import BaseModel
from typing import Optional ,List
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


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

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = await get_user_by_email(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

def str_to_objectid(id: str):
    try:
        return ObjectId(id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")

@app.post('/user', response_model=Usersdata)
async def post_user(user: Usersdata):
    user.password = get_password_hash(user.password)
    response = await create_user(user.dict())
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user_by_email(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(form_data.password, user['password']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['email']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=Usersdata)
async def read_users_me(current_user: Usersdata = Depends(get_current_user)):
    return current_user

@app.post('/notes', response_model=Notes)
async def create_note(note: Notes, current_user: Usersdata = Depends(get_current_user)):
    note_data = note.dict()
    note_data['user_id'] = str(current_user['_id'])
    result = await collection.insert_one(note_data)
    if result.inserted_id:
        return {"id": str(result.inserted_id), **note_data}
    raise HTTPException(status_code=400, detail="Failed to create note")

@app.get('/notes', response_model=List[Notes])
async def get_notes_for_user(current_user: Usersdata = Depends(get_current_user)):
    user_id = str(current_user['_id'])
    notes = await fetch_notes_by_user(user_id)
    return notes



###############################################################################################################################

@app.get("/api/notes")
async def get_notes():
    response = await fetch_all_notes()
    return response

@app.get("/api/notes/{title}", response_model=Notes)
async def get_notes_by_title(title):
    response = await fetch_one_note(title)
    if response:
        return response
    raise HTTPException(404, f"There is no notes with the title {title}")

@app.post("/api/notes/", response_model=Notes)
async def post_notes(notes: Notes):
    response = await create_notes(notes.dict())
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

@app.put("/api/notes/{title}/", response_model=Notes)
async def put_notes(title: str, desc: str):
    response = await update_notes(title, desc)
    if response:
        return response
    raise HTTPException(404, f"There is no todo with the title {title}")


@app.delete("/api/notes/{title}")
async def delete_notes(title):
    response = await remove_notes(title)
    if response:
        return "Successfully deleted notes"
    raise HTTPException(404, f"There is no notes with the title {title}")

@app.post('/user',response_model=Usersdata)
async def post_user(user:Usersdata):
    response = await create_user(user.dict())
    if response:
        return response
    raise HTTPException(400, "Something went wrong")

