import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Queue extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "queue",
            description: {
                content: "cmd.queue.description",
                examples: ["queue"],
                usage: "queue",
            },
            category: "music",
            aliases: ["q"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
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
        const embed = this.client.embed();
        if (player.queue.length === 0) {
            return await ctx.sendMessage({
                embeds: [
                    embed.setColor(this.client.color.main).setDescription(
                        ctx.locale("cmd.queue.now_playing", {
                            title: player.current.info.title,
                            uri: player.current.info.uri,
                            requester: player.current?.info.requester,
                            duration: player.current.info.isStream
                                ? ctx.locale("cmd.queue.live")
                                : client.utils.formatTime(player.current.info.length),
                        }),
                    ),
                ],
            });
        }
        const songStrings = [];
        for (let i = 0; i < player.queue.length; i++) {
            const track = player.queue[i];
            songStrings.push(
                ctx.locale("cmd.queue.track_info", {
                    index: i + 1,
                    title: track.info.title,
                    uri: track.info.uri,
                    requester: track?.info.requester,
                    duration: track.info.isStream ? ctx.locale("cmd.queue.live") : client.utils.formatTime(track.info.length),
                }),
            );
        }
        let chunks = client.utils.chunk(songStrings, 10);

        if (chunks.length === 0) chunks = [songStrings];

        const pages = chunks.map((chunk, index) => {
            return this.client
                .embed()
                .setColor(this.client.color.main)
                .setAuthor({ name: ctx.locale("cmd.queue.title"), iconURL: ctx.guild.iconURL({}) })
                .setDescription(chunk.join("\n"))
                .setFooter({ text: ctx.locale("cmd.queue.page_info", { index: index + 1, total: chunks.length }) });
        });
        return await client.utils.paginate(client, ctx, pages);
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
