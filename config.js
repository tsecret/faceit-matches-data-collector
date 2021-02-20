require('dotenv').config()

module.exports = {
    PORT: 9000,
    SUBDOMAIN: "faugur-matches",
    FACEIT_API_KEY: `Bearer ${process.env.FACEIT_API_KEY}`,
    FACEIT_AUTH_TOKEN: process.env.FACEIT_AUTH_TOKEN,
    FACEIT_APP_ID: process.env.FACEIT_APP_ID,
}