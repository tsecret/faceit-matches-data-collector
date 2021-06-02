import axios from 'axios';
import config from './config';
import { Settings } from './types';

const headers = {"Authorization": `Bearer ${config.FACEIT_AUTH_TOKEN}`}

export const getWebhooksSettings = async () => {
    return await axios.get('https://api.faceit.com/webhooks/v1/subscriptions', {params: { app_id: config.FACEIT_APP_ID }, headers})
    .then((response: any) => response.data.payload[0])
    .catch((error: any) => { console.log("getWebhooksSettings error:", error.response.data) })
}

// Webhooks id, new settings
export const updateWebhooksSettings = async (settings: Settings) => {
    return await axios.put(`https://api.faceit.com/webhooks/v1/subscriptions/${settings.id}`, settings,  {headers})
    .then((response: any) => response.data.payload)
    .catch((error: any) => { console.log("updateWebhooksSettings error", error.response.data) })
}

export const updateDomain = async (domain: string) => {
    const settings: Settings = await getWebhooksSettings();
    settings.url = `https://${domain}.loca.lt/webhooks/add`;
    return await updateWebhooksSettings(settings);
}

export const updateURL = async (url: string) => {
    const settings: Settings = await getWebhooksSettings();
    settings.url = url;
    return await updateWebhooksSettings(settings);
}

export const getMatch = async (matchID: string) => {
    return await axios.get(`https://api.faceit.com/match/v2/match/${matchID}`)
    .then((res: { data: any; }) => res.data.payload)
    .catch((error: {response: any}) => { console.log(error) })
}

export const getPlayerInfo = async (id:string) => {
    return await axios.get(`https://api.faceit.com/core/v1/users/${id}`)
    .then((res: { data: any; }) => res.data)
    .catch((error: any) => {console.log(error)})
}

export const getPlayersInfo = async (ids: string[]) => {
    let promises = ids.map((id: any) => axios.get(`https://api.faceit.com/core/v1/users/${id}`))
    return await axios.all(promises).then(axios.spread((...responses: any[]) => responses.map(response => response.data.payload)))
}

export const getPlayerMatches = async (id: string) => {
    return await axios.get(`https://api.faceit.com/stats/v1/stats/time/users/${id}/games/csgo`)
    .then((res: { data: any; }) => res.data)
    .catch((error: any) => {console.log(error);})
}

export const getPlayersMatches = async (ids: string[]) => {
    const promises = ids.map((id: any) => axios.get(`https://api.faceit.com/stats/v1/stats/time/users/${id}/games/csgo`))
    return await axios.all(promises).then(axios.spread((...responses: any[]) => responses.map(response => response.data)))
}