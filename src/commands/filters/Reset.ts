import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Reset extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "reset",
            description: {
                content: "cmd.reset.description",
                examples: ["reset"],
                usage: "reset",
            },
            category: "filters",
            aliases: ["rs"],
            cooldown: 3,
            args: false,
            player: {
                voice: true,
                dj: true,
                active: false,
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
        player.player.clearFilters();
        player.filters = [];
        await ctx.sendMessage({
            embeds: [
                {
                    description: ctx.locale("cmd.reset.messages.filters_reset"),
                    color: this.client.color.main,
                },
            ],
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
