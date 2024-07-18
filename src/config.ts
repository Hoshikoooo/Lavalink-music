import dotenv from "dotenv";
import { Language, SearchEngine } from "./types.js";
dotenv.config();

const parseBoolean = (value?: string): boolean => value?.trim().toLowerCase() === "true";

export default {
    token: process.env.TOKEN,
    prefix: process.env.PREFIX,
    color: {
        red: 0xff0000,
        green: 0x00ff00,
        blue: 0x0000ff,
        yellow: 0xffff00,
        main: 0x2f3136,
    },
    defaultLanguage: process.env.DEFAULT_LANGUAGE || Language.EnglishUS,
    keepAlive: parseBoolean(process.env.KEEP_ALIVE),
    autoNode: parseBoolean(process.env.AUTO_NODE),
    searchEngine: process.env.SEARCH_ENGINE || SearchEngine.YouTube,
    maxPlaylistSize: parseInt(process.env.MAX_PLAYLIST_SIZE || "100"),
    botStatus: process.env.BOT_STATUS || "online",
    botActivity: process.env.BOT_ACTIVITY || "Lavamusic",
    botActivityType: parseInt(process.env.BOT_ACTIVITY_TYPE || "2"),
    maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE || "100"),
    owners: process.env.OWNER_IDS ? JSON.parse(process.env.OWNER_IDS) : [],
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    logChannelId: process.env.LOG_CHANNEL_ID,
    links: {
        img: process.env.IMG_LINK || "https://i.imgur.com/ud3EWNh.jpg",
    },
    icons: {
        youtube: "https://i.imgur.com/xzVHhFY.png",
        spotify: "https://i.imgur.com/qvdqtsc.png",
        soundcloud: "https://i.imgur.com/MVnJ7mj.png",
        applemusic: "https://i.imgur.com/Wi0oyYm.png",
        deezer: "https://i.imgur.com/xyZ43FG.png",
    },
    production: parseBoolean(process.env.PRODUCTION) ?? true,
    lavalink: [
        {
            url: process.env.LAVALINK_URL,
            auth: process.env.LAVALINK_AUTH,
            name: process.env.LAVALINK_NAME,
            secure: parseBoolean(process.env.LAVALINK_SECURE),
        },
    ],
};

/**
 * Project: lavamusic
 * Author: Appu
 * Main Contributor: LucasB25
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
