import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Karaoke extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "karaoke",
            description: {
                content: "cmd.karaoke.description",
                examples: ["karaoke"],
                usage: "karaoke",
            },
            category: "filters",
            aliases: ["kk"],
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
        const filterEnabled = player.filters.includes("karaoke");

        if (filterEnabled) {
            await player.player.setKaraoke();
            player.filters = player.filters.filter((filter) => filter !== "karaoke");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.karaoke.messages.filter_disabled"),
                        color: this.client.color.main,
                    },
                ],
            });
        } else {
            await player.player.setKaraoke({
                level: 1,
                monoLevel: 1,
                filterBand: 220,
                filterWidth: 100,
            });
            player.filters.push("karaoke");
            await ctx.sendMessage({
                embeds: [
                    {
                        description: ctx.locale("cmd.karaoke.messages.filter_enabled"),
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
