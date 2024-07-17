
import motor.motor_asyncio
from model import Notes
from bson import ObjectId
from fastapi import  HTTPException
client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017/')
database = client.Notepad
collection = database.notes
userdata = database.users

async def fetch_one_note(title):
    document = await collection.find_one({"title": title})
    return document

async def fetch_all_notes():
    notes = []
    cursor = collection.find({})
    async for document in cursor:
        notes.append(Notes(**document))
    return notes

async def create_notes(notes):
    document = notes
    result = await collection.insert_one(document)
    return document

async def update_notes(title:str, description: str):
    await collection.update_one({"title": title}, {"$set": {"description": description}})
    document = await collection.find_one({"title": title})
    return document

async def remove_notes(title):
    await collection.delete_one({"title": title})
    return True

async def create_user(users):
    data = users
    await userdata.insert_one(data)
    return data

async def get_user_by_email(email: str):
    user = await userdata.find_one({"email": email})
    return user

async def fetch_notes_by_user(user_id: str):
    notes = []
    cursor = collection.find({"user_id": user_id})
    async for document in cursor:
        notes.append(Notes(**document))
    return notes