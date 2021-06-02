import localtunnel from 'localtunnel';
import express from 'express';
import firebase from 'firebase';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';

import {
    updateDomain,
    updateURL,
    getWebhooksSettings,
    updateWebhooksSettings,
    getMatch,
    getPlayerMatches,
    getPlayersMatches,
    getPlayersInfo
} from './api';

import {
    Hook,
    Match,
    Player, 
    Settings
} from './types';

import {
    now, 
    getListFromFirestore, 
    getUsersFromMatch, 
    addUsersToSettings
} from './utils';

const app = express()
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

firebase.initializeApp(config.FIREBASE_CONFIG);

let matches: any = [];

const init = async () => {
    // const tunnel = await localtunnel({ port: config.PORT, subdomain: config.SUBDOMAIN })
  
    // console.log(`Tunnel ready at ${tunnel.url}`);
  
    // tunnel.on('close', () => {
    //     console.log("Tunnel closed")
    // });

    // const settings = await getWebhooksSettings();
}

const checkMatches = async () => {
    if (matches.length >= config.MATCHES_BATCH){
        const batch = firebase.firestore().batch();
        matches.forEach((match: any) => { batch.set(firebase.firestore().collection('raw-matches').doc(match.id), match) })
        await batch.commit();
        console.log(`Saved ${config.MATCHES_BATCH} matches`);
        matches = [];
    }
}

// init();

app.get('/', (req, res) => {
    return res.status(200).json("ok")
})

app.post('/update/domain', async (req, res) => {
    const { name } = req.body;
    const response: any = await updateDomain(name);
    return res.status(200).json();
})

app.post('/update/url', async (req, res) => {
    const { url } = req.body;
    const response: any = await updateURL(url);
    return res.status(200).json();
})

app.post('/webhooks/add', async (req, res) => {
    const { event, payload }: Hook = req.body;

    if(event !== 'match_status_finished') return res.status(401).json();

    matches.push(payload)
    console.log("Match", payload.id);
    await checkMatches();

    return res.status(200).json();
})

app.get('/stats', async (req, res) => {
    try{
        const matches: Match[] = await firebase.firestore().collection('raw-matches').get()
        .then(snapshot => getListFromFirestore(snapshot))
        
        const players: string[] = []

        matches.forEach((match: Match) => {
            const matchPlayers: string[] = getUsersFromMatch(match);
            matchPlayers.forEach((player: string) => { if(!players.includes(player)) players.push(player) })
        })


        return res.status(200).json({
            matches: matches.length,
            players: players.length
        })
    } catch(err){
        console.error(err)
        return res.status(500).json()
    }
})

app.post('/sync', async (req, res) => {
    try{
        const startTime = now();
        const matches: Match[] = await firebase.firestore().collection('raw-matches').get()
        .then(snapshot => getListFromFirestore(snapshot))
        
        const players: string[] = []

        matches.forEach((match: Match) => {
            const matchPlayers: string[] = getUsersFromMatch(match);
            matchPlayers.forEach((player: string) => { if(!players.includes(player)) players.push(player) })
        })

        let settings: Settings = await getWebhooksSettings();
        const playersBefore = settings.restrictions.length;
        const savedUsers = settings.restrictions.map((user: any) => user.value)
        const mergedUsers = [...new Set([ ...players, ...savedUsers ])];
        settings = addUsersToSettings(mergedUsers, settings)
        const newSettings: Settings = await updateWebhooksSettings(settings);

        return res.status(200).json({
            playersBefore,
            playersAfter: newSettings.restrictions.length,
            operationTime: now() - startTime
        })
    } catch(err){
        console.error(err)
        return res.status(500).json()
    }
})

app.post('/parse', async (req, res) => {
    const { matchID } = req.body;

    const match: Match = await getMatch(matchID);
    const players: string[] = getUsersFromMatch(match);

    const playersStats = await getPlayersMatches(players);;
    const playersInfo = await getPlayersInfo(players);

    return res.status(200).json(playersInfo)
})

app.listen(config.PORT, config.HOST, () => { console.log(`Running on port: ${config.PORT}`) })