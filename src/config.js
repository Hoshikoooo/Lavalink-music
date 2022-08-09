require("dotenv").config();

module.exports = {
    token: process.env.TOKEN || "MTAwNjM4OTg1OTI3Mjg4ODQxMA.GVBxSW.78mnsD5dl-z76Tl_hrk_hEalzKkPcuG6EHuNls",  // your bot token
    clientID: process.env.CLIENT_ID || "1006389859272888410", // your bot client id
    prefix: process.env.PREFIX || "!", // bot prefix
    ownerID: process.env.OWNERID || "797452849579688018", //your discord id
    SpotifyID: process.env.SPOTIFYID || "",
    SpotifySecret: process.env.SPOTIFYSECRET || "",
    mongourl: process.env.MONGO_URI || "", // MongoDb URL
    embedColor: process.env.COlOR || 0x303236, // embed colour
    logs: process.env.LOGS || "1006395447872606209", // channel id for guild create and delete logs
    links: {
        img: process.env.IMG || 'https://media.discordapp.net/attachments/963097935820750878/983300268131225651/20220606_145403.png', //setup system background image 
        support: process.env.SUPPORT || 'https://discord.gg/ns8CTk9J3e', //support server invite link
        invite: process.env.INVITE || 'https://discord.com/oauth2/authorize?client_id=977742811132743762&permissions=8&scope=bot%20applications.commands' //bot invite link
    },
    nodes: [
        {
            host: process.env.NODE_HOST || "localhost",
            identifier: process.env.NODE_ID || "local",
            port: parseInt(process.env.NODE_PORT || "80"),
            password: process.env.NODE_PASSWORD || "coders",
            secure: parseBoolean(process.env.NODE_SECURE || "false"),

        }
    ],

}

function parseBoolean(value) {
    if (typeof (value) === 'string') {
        value = value.trim().toLowerCase();
    }
    switch (value) {
        case true:
        case "true":
            return true;
        default:
            return false;
    }
}
