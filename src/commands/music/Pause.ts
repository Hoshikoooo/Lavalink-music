import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Pause extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "pause",
            description: {
                content: "cmd.pause.description",
                examples: ["pause"],
                usage: "pause",
            },
            category: "music",
            aliases: ["pu"],
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

        if (player?.paused) {
            return await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.player.errors.already_paused"))],
            });
        }

        player?.pause();

        return await ctx.sendMessage({
            embeds: [embed.setColor(this.client.color.main).setDescription(ctx.locale("cmd.pause.successfully_paused"))],
        });
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
