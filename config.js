require('dotenv').config()

module.exports = {
    PORT: 9000,
    SUBDOMAIN: "faugur-matches",
    MATCHES_BATCH: 100,
    FACEIT_API_KEY: `Bearer ${process.env.FACEIT_API_KEY}`,
    FACEIT_AUTH_TOKEN: process.env.FACEIT_AUTH_TOKEN,
    FACEIT_APP_ID: process.env.FACEIT_APP_ID,
    FIREBASE_CONFIG: {
        apiKey: "AIzaSyCr9YbS8NSmqdZ0bVcYrBvj069UBOzf74o",
        authDomain: "faceit-stats-15518.firebaseapp.com",
        databaseURL: "https://faceit-stats-15518.firebaseio.com",
        projectId: "faceit-stats-15518",
        storageBucket: "faceit-stats-15518.appspot.com",
        messagingSenderId: "860337496918",
        appId: "1:860337496918:web:8277dc6963d431b856ecf7",
        measurementId: "G-7QQRT9H5BE"
    }
}