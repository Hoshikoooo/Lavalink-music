import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class _8d extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "8d",
            description: {
                content: "cmd.8d.description",
                examples: ["8d"],
                usage: "8d",
            },
            category: "filters",
            aliases: ["3d"],
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
        const filterEnabled = player.filters.includes("8D");
        const rotationConfig = filterEnabled ? {} : { rotationHz: 0.2 };

        await player.player.setRotation(rotationConfig);

        if (filterEnabled) {
            player.filters = player.filters.filter((filter) => filter !== "8D");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.8d.messages.filter_disabled"),
                        color: this.client.color.main,
                    },
                ],
            });
        } else {
            player.filters.push("8D");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.8d.messages.filter_enabled"),
                        color: this.client.color.main,
                    },
                ],
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
