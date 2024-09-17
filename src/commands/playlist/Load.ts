import type { AutocompleteInteraction, GuildMember } from "discord.js";
import { Command, type Context, type Lavamusic } from "../../structures/index";

export default class LoadPlaylist extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "load",
            description: {
                content: "cmd.load.description",
                examples: ["load <playlist>"],
                usage: "load <playlist>",
            },
            category: "playlist",
            aliases: ["lo"],
            cooldown: 3,
            args: true,
            vote: true,
            player: {
                voice: true,
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
                    description: "cmd.load.options.playlist",
                    type: 3,
                    required: true,
                    autocomplete: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        let player = client.manager.getPlayer(ctx.guild!.id);
        const playlistName = args.join(" ").trim();
        const playlistData = await client.db.getPlaylist(ctx.author.id, playlistName);
        if (!playlistData) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.load.messages.playlist_not_exist"),
                        color: this.client.color.red,
                    },
                ],
            });
        }

        const songs = await client.db.getTracksFromPlaylist(ctx.author.id, playlistName);
        if (songs.length === 0) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.load.messages.playlist_empty"),
                        color: client.color.red,
                    },
                ],
            });
        }

        const member = ctx.member as GuildMember;
        if (!player) {
            player = client.manager.createPlayer({
                guildId: ctx.guild!.id,
                voiceChannelId: member.voice.channelId,
                textChannelId: ctx.channel.id,
                selfMute: false,
                selfDeaf: true,

                vcRegion: member.voice.channel.rtcRegion,
            });
            if (!player.connected) await player.connect();
        }

        const nodes = client.manager.nodeManager.leastUsedNodes();
        const node = nodes[Math.floor(Math.random() * nodes.length)];
        const tracks = await node.decode.multipleTracks(songs as any, ctx.author);
        if (tracks.length === 0) {
            return await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.load.messages.playlist_empty"),
                        color: client.color.red,
                    },
                ],
            });
        }
        player.queue.add(tracks);

        if (!player.playing) await player.play({ paused: false });

        return await ctx.sendMessage({
            embeds: [
                {
                    description: ctx.locale("cmd.load.messages.playlist_loaded", { name: playlistData.name, count: songs.length }),
                    color: this.client.color.main,
                },
            ],
        });
    }

    public async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
        const focusedValue = interaction.options.getFocused();
        const userId = interaction.user.id;

        const playlists = await this.client.db.getUserPlaylists(userId);

        const filtered = playlists.filter((playlist) => playlist.name.toLowerCase().startsWith(focusedValue.toLowerCase()));

        await interaction.respond(
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
