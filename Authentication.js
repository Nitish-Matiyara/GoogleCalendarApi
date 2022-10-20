const dotenv = require("dotenv")
dotenv.config()
// Require google from googleapis package.
const { google } = require("googleapis");

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth;


// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  access_token: process.env.ACCESS_TOKEN,
  refresh_token: process.env.REFRESH_TOKEN,
});

// Create a new calender instance.
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });


module.exports = {calendar, oAuth2Client}