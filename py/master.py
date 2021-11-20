from fastapi import FastAPI
import requests
import time
from pydantic import BaseModel


app = FastAPI()

headers={
        "Authorization": "Bearer 2c9faf4a-1b59-4cf8-87ba-1a537c2de4ff"
    }
params={
    "app_id": "dd3b8614-b1a9-438f-9ab0-a24269620738"
}



def getSettings():
    starTime = time.time()

    res = requests.get("https://api.faceit.com/webhooks/v1/subscriptions", headers=headers, params=params)
    elapsed = round(time.time() - starTime, 2)
    print("Request took", elapsed, "seconds")

    for sett in res.json()['payload']:
        if sett['id'] == 'abe878d4-088f-4f0b-b79e-927df28bcf72':
            return sett

def updateSettings(settings: object):
    starTime = time.time()
    res = requests.post(f'https://api.faceit.com/webhooks/v1/subscriptions/{settings["id"]}', data=settings, headers=headers)
    elapsed = round(time.time() - starTime, 2)
    print("Request took", elapsed, "seconds")
    if res.status_code == 200:
        return res.json()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get('/settings/get')
async def get_settings():
    settings = getSettings()
    return settings

class newSettings(BaseModel):
    players: list

@app.post('/settings/update')
async def set_settings(newSettings: newSettings):
    settingsData = getSettings()
    settingsData['restrictions'].extend([{ "type": "user", "value": player } for player in newSettings.players])
    return updateSettings(settingsData)


class Payload(BaseModel):
    event: str
    payload: object

    class Config:
        arbitrary_types_allowed = True

mat = None

@app.post('/webhook')
async def add_webhook(payload: Payload):
    if payload.event != "match_status_finished": return
    print(payload.payload['id'])
    global mat
    mat = payload.payload
    players = []
    for team in payload.payload['teams']:
        players.extend([player['id'] for player in team['roster']])

    with open('players.txt', 'a', encoding='utf-8') as f:
        for player in players:
            f.write(player + "\n")

    return

@app.get('/webhook')
async def get_webhook():
    global mat
    return mat
