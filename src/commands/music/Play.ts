import { LoadType } from "shoukaku";
import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Play extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "play",
            description: {
                content: "cmd.play.description",
                examples: [
                    "play example",
                    "play https://www.youtube.com/watch?v=example",
                    "play https://open.spotify.com/track/example",
                    "play http://www.example.com/example.mp3",
                ],
                usage: "play <song>",
            },
            category: "music",
            aliases: ["p"],
            cooldown: 3,
            args: true,
            player: {
                voice: true,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks", "Connect", "Speak"],
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "song",
                    description: "cmd.play.options.song",
                    type: 3,
                    required: true,
                    autocomplete: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const query = args.join(" ");
        await ctx.sendDeferMessage(ctx.locale("cmd.play.loading"));
        let player = client.queue.get(ctx.guild!.id);
        const vc = ctx.member as any;
        if (!player) player = await client.queue.create(ctx.guild, vc.voice.channel, ctx.channel);
        const res = await this.client.queue.search(query);
        const embed = this.client.embed();

        switch (res.loadType) {
            case LoadType.ERROR:
                ctx.editMessage({
                    content: "",
                    embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.play.errors.search_error"))],
                });
                break;
            case LoadType.EMPTY:
                ctx.editMessage({
                    content: "",
                    embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.play.errors.no_results"))],
                });
                break;
            case LoadType.TRACK: {
                const track = player.buildTrack(res.data, ctx.author);
                if (player.queue.length > client.config.maxQueueSize)
                    return await ctx.editMessage({
                        content: "",
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(ctx.locale("cmd.play.errors.queue_too_long", { maxQueueSize: client.config.maxQueueSize })),
                        ],
                    });
                player.queue.push(track);
                await player.isPlaying();
                ctx.editMessage({
                    content: "",
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(ctx.locale("cmd.play.added_to_queue", { title: res.data.info.title, uri: res.data.info.uri })),
                    ],
                });
                break;
            }
            case LoadType.PLAYLIST: {
                if (res.data.tracks.length > client.config.maxPlaylistSize)
                    return await ctx.editMessage({
                        content: "",
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(
                                    ctx.locale("cmd.play.errors.playlist_too_long", { maxPlaylistSize: client.config.maxPlaylistSize }),
                                ),
                        ],
                    });
                for (const track of res.data.tracks) {
                    const pl = player.buildTrack(track, ctx.author);
                    if (player.queue.length > client.config.maxQueueSize)
                        return await ctx.editMessage({
                            content: "",
                            embeds: [
                                embed
                                    .setColor(this.client.color.red)
                                    .setDescription(
                                        ctx.locale("cmd.play.errors.queue_too_long", { maxQueueSize: client.config.maxQueueSize }),
                                    ),
                            ],
                        });
                    player.queue.push(pl);
                }
                await player.isPlaying();
                ctx.editMessage({
                    content: "",
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(ctx.locale("cmd.play.added_playlist_to_queue", { length: res.data.tracks.length })),
                    ],
                });
                break;
            }
            case LoadType.SEARCH: {
                const track1 = player.buildTrack(res.data[0], ctx.author);
                if (player.queue.length > client.config.maxQueueSize)
                    return await ctx.editMessage({
                        content: "",
                        embeds: [
                            embed
                                .setColor(this.client.color.red)
                                .setDescription(ctx.locale("cmd.play.errors.queue_too_long", { maxQueueSize: client.config.maxQueueSize })),
                        ],
                    });
                player.queue.push(track1);
                await player.isPlaying();
                ctx.editMessage({
                    content: "",
                    embeds: [
                        embed
                            .setColor(this.client.color.main)
                            .setDescription(
                                ctx.locale("cmd.play.added_to_queue", { title: res.data[0].info.title, uri: res.data[0].info.uri }),
                            ),
                    ],
                });
                break;
            }
        }
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
