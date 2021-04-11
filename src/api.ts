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