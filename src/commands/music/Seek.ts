import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Seek extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "seek",
            description: {
                content: "cmd.seek.description",
                examples: ["seek 1m, seek 1h 30m", "seek 1h 30m 30s"],
                usage: "seek <duration>",
            },
            category: "music",
            aliases: ["s"],
            cooldown: 3,
            args: true,
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
            options: [
                {
                    name: "duration",
                    description: "cmd.seek.options.duration",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const player = client.queue.get(ctx.guild!.id);
        const current = player.current.info;
        const embed = this.client.embed();
        const duration = client.utils.parseTime(args.join(" "));
        if (!duration) {
            return await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.seek.errors.invalid_format"))],
            });
        }
        if (!current.isSeekable) {
            return await ctx.sendMessage({
                embeds: [embed.setColor(this.client.color.red).setDescription(ctx.locale("cmd.seek.errors.not_seekable"))],
            });
        }
        if (duration > current.length) {
            return await ctx.sendMessage({
                embeds: [
                    embed
                        .setColor(this.client.color.red)
                        .setDescription(ctx.locale("cmd.seek.errors.beyond_duration", { length: client.utils.formatTime(current.length) })),
                ],
            });
        }
        player.seek(duration);
        return await ctx.sendMessage({
            embeds: [
                embed
                    .setColor(this.client.color.main)
                    .setDescription(ctx.locale("cmd.seek.messages.seeked_to", { duration: client.utils.formatTime(duration) })),
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
