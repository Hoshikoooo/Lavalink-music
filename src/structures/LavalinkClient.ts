import { LavalinkManager, type LavalinkNodeOptions, type SearchPlatform, type SearchResult } from "lavalink-client";
import { autoPlayFunction, requesterTransformer } from "../utils/functions/player";
import type Lavamusic from "./Lavamusic";

export default class LavalinkClient extends LavalinkManager {
    public client: Lavamusic;
    constructor(client: Lavamusic) {
        super({
            nodes: client.env.NODES as LavalinkNodeOptions[],
            sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
            queueOptions: {
                maxPreviousTracks: 25,
            },
            playerOptions: {
                defaultSearchPlatform: client.env.SEARCH_ENGINE,
                onDisconnect: {
                    autoReconnect: true,
                    destroyPlayer: false,
                },
                requesterTransformer: requesterTransformer,
                onEmptyQueue: {
                    autoPlayFunction,
                },
            },
        });
        this.client = client;
    }
    /**
     * Searches for a song and returns the tracks.
     * @param query The query to search for.
     * @param user The user who requested the search.
     * @param source The source to search in. Defaults to youtube.
     * @returns An array of tracks that match the query.
     */
    public async search(query: string, user: unknown, source?: SearchPlatform): Promise<SearchResult> {
        const nodes = this.nodeManager.leastUsedNodes();
        const node = nodes[Math.floor(Math.random() * nodes.length)];
        const result = await node.search({ query, source }, user, false);
        return result;
    }
}

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
