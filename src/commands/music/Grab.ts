import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Grab extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "grab",
            description: {
                content: "cmd.grab.description",
                examples: ["grab"],
                usage: "grab",
            },
            category: "music",
            aliases: ["gr"],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
                active: true,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: [],
            },
            slashCommand: true,
            options: [],
        });
    }

    public async run(client: Lavamusic, ctx: Context): Promise<any> {
        const player = client.queue.get(ctx.guild!.id);

        if (!player?.current) {
            return await ctx.sendMessage({
                embeds: [this.client.embed().setColor(this.client.color.red).setDescription(ctx.locale("cmd.player.errors.no_song"))],
            });
        }

        const song = player.current;

        const songInfo = ctx.locale("cmd.grab.content", {
            title: song.info.title,
            uri: song.info.uri,
            artworkUrl: song.info.artworkUrl,
            length: song.info.isStream ? "LIVE" : client.utils.formatTime(song.info.length),
            requester: song.info.requester,
        });

        try {
            await ctx.author?.send({
                embeds: [
                    this.client
                        .embed()
                        .setTitle(`**${song.info.title}**`)
                        .setURL(song.info.uri!)
                        .setThumbnail(song.info.artworkUrl!)
                        .setDescription(songInfo)
                        .setColor(this.client.color.main),
                ],
            });

            return await ctx.sendMessage({
                embeds: [this.client.embed().setDescription(ctx.locale("cmd.grab.check_dm")).setColor(this.client.color.green)],
            });
        } catch (_e) {
            return await ctx.sendMessage({
                embeds: [this.client.embed().setDescription(ctx.locale("cmd.grab.dm_failed")).setColor(this.client.color.red)],
            });
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
