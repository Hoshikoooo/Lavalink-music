import type { AutocompleteInteraction } from "discord.js";
import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class AddSong extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "addsong",
            description: {
                content: "cmd.addsong.description",
                examples: ["addsong test exemple", "addsong exemple https://www.youtube.com/watch?v=example"],
                usage: "addsong <playlist> <song>",
            },
            category: "playlist",
            aliases: ["as"],
            cooldown: 3,
            args: true,
            vote: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ReadMessageHistory", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "playlist",
                    description: "cmd.addsong.options.playlist",
                    type: 3,
                    required: true,
                    autocomplete: true,
                },
                {
                    name: "song",
                    description: "cmd.addsong.options.song",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const playlist = args.shift();
        const song = args.join(" ");

        if (!playlist) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.addsong.messages.no_playlist"),
                        color: this.client.color.red,
                    },
                ],
            });
        }

        if (!song) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.addsong.messages.no_song"),
                        color: this.client.color.red,
                    },
                ],
            });
        }
        const res = await client.manager.search(song, ctx.author);
        if (!res) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.addsong.messages.no_songs_found"),
                        color: this.client.color.red,
                    },
                ],
            });
        }

        const playlistData = await client.db.getPlaylist(ctx.author.id, playlist);
        if (!playlistData) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.addsong.messages.playlist_not_found"),
                        color: this.client.color.red,
                    },
                ],
            });
        }

        let trackStrings: any;
        let count: number;
        if (res.loadType === "playlist") {
            trackStrings = res.tracks.map((track) => track.encoded);
            count = res.tracks.length;
        } else if (res.loadType === "track") {
            trackStrings = [res.tracks[0].encoded];
            count = 1;
        } else if (res.loadType === "search") {
            trackStrings = [res.tracks[0].encoded];
            count = 1;
        }

        await client.db.addTracksToPlaylist(ctx.author.id, playlist, trackStrings);

        return await ctx.sendMessage({
            embeds: [
                {
                    description: ctx.locale("cmd.addsong.messages.added", { playlist: playlistData.name, count }),
                    color: this.client.color.green,
                },
            ],
        });
    }

    public async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const focusedValue = interaction.options.getFocused();
        const userId = interaction.user.id;

        const playlists = await this.client.db.getUserPlaylists(userId);

        const filtered = playlists.filter((playlist) => playlist.name.toLowerCase().startsWith(focusedValue.toLowerCase()));

        return await interaction.respond(
            filtered.map((playlist) => ({
                name: playlist.name,
                value: playlist.name,
            })),
        );
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
