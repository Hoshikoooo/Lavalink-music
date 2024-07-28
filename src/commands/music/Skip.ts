import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Skip extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "skip",
            description: {
                content: "cmd.skip.description",
                examples: ["skip"],
                usage: "skip",
            },
            category: "music",
            aliases: ["sk"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
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
                embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.player.errors.no_songs"))],
            });
        }
        const currentTrack = player.current.info;
        player.skip();
        if (ctx.isInteraction) {
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.main)
                        .setDescription(ctx.locale("cmd.skip.messages.skipped", { title: currentTrack.title, uri: currentTrack.uri })),
                ],
            });
        }
        ctx.message?.react("👍");
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
