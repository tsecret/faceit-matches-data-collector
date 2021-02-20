const axios = require('axios');
const config = require('./config'); 

let headers = {"Authorization": `Bearer ${config.FACEIT_AUTH_TOKEN}`}

const getWebhooksSettings = async () => {
    return await axios.get('https://api.faceit.com/webhooks/v1/subscriptions', {params: { app_id: config.FACEIT_APP_ID }, headers})
    .then(response => response.data.payload)
    .catch(error => { console.log(error.response.data) })
}

// Webhooks id, new settings
const updateWebhooksSettings = async (settings) => {
    return await axios.put(`https://api.faceit.com/webhooks/v1/subscriptions/${settings.id}`, settings,  {headers})
    .then(response => response.data.payload)
    .catch(error => { console.log(error.response.data) })
}

module.exports = {
    getWebhooksSettings,
    updateWebhooksSettings
}