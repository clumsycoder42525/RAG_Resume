from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import uuid

router = APIRouter()

DATA_FILE = "data/bots.json"

class BotCreate(BaseModel):
    name: str
    description: Optional[str] = None
    theme: str = "modern"
    primary_color: str = "#3b82f6"
    avatar_url: Optional[str] = None

class Bot(BotCreate):
    id: str

def load_bots() -> List[dict]:
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_bots(bots: List[dict]):
    with open(DATA_FILE, "w") as f:
        json.dump(bots, f, indent=4)

@router.post("/", response_model=Bot)
async def create_bot(bot_in: BotCreate):
    bots = load_bots()
    new_bot = {
        **bot_in.dict(),
        "id": str(uuid.uuid4())
    }
    bots.append(new_bot)
    save_bots(bots)
    return new_bot

@router.get("/", response_model=List[Bot])
async def list_bots():
    return load_bots()

@router.get("/{bot_id}", response_model=Bot)
async def get_bot(bot_id: str):
    bots = load_bots()
    for bot in bots:
        if bot["id"] == bot_id:
            return bot
    raise HTTPException(status_code=404, detail="Bot not found")

@router.delete("/{bot_id}")
async def delete_bot(bot_id: str):
    bots = load_bots()
    new_bots = [b for b in bots if b["id"] != bot_id]
    if len(new_bots) == len(bots):
        raise HTTPException(status_code=404, detail="Bot not found")
    save_bots(new_bots)
    return {"message": "Bot deleted"}

@router.put("/{bot_id}", response_model=Bot)
async def update_bot(bot_id: str, bot_in: BotCreate):
    bots = load_bots()
    for i, bot in enumerate(bots):
        if bot["id"] == bot_id:
            updated_bot = {
                **bot_in.dict(),
                "id": bot_id
            }
            bots[i] = updated_bot
            save_bots(bots)
            return updated_bot
    raise HTTPException(status_code=404, detail="Bot not found")
