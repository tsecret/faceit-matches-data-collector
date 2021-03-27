import localtunnel from 'localtunnel';
import express from 'express';
import firebase from 'firebase';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config';

import { updateDomain } from './api';
import { Hook } from './types';

const app = express()
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

firebase.initializeApp(config.FIREBASE_CONFIG);

let matches: any = [];

const init = async () => {
    const tunnel = await localtunnel({ port: config.PORT, subdomain: config.SUBDOMAIN })
  
    console.log(`Tunnel ready at ${tunnel.url}`);
  
    tunnel.on('close', () => {
        console.log("Tunnel closed")
    });

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

init();

app.post('/domain/update', async (req, res) => {
    const { name } = req.body;
    const response: any = await updateDomain(name);
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

app.listen(config.PORT, () => { console.log(`Running on port: ${config.PORT}`) })