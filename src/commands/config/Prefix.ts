import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class Prefix extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "prefix",
            description: {
                content: "cmd.prefix.description",
                examples: ["prefix set !", "prefix reset"],
                usage: "prefix",
            },
            category: "general",
            aliases: ["pf"],
            cooldown: 3,
            args: true,
            player: {
                voice: false,
                dj: false,
                active: false,
                djPerm: null,
            },
            permissions: {
                dev: false,
                client: ["SendMessages", "ViewChannel", "EmbedLinks"],
                user: ["ManageGuild"],
            },
            slashCommand: true,
            options: [
                {
                    name: "set",
                    description: "cmd.prefix.options.set",
                    type: 1,
                    options: [
                        {
                            name: "prefix",
                            description: "cmd.prefix.options.prefix",
                            type: 3,
                            required: true,
                        },
                    ],
                },
                {
                    name: "reset",
                    description: "cmd.prefix.options.reset",
                    type: 1,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const embed = client.embed().setColor(this.client.color.main);
        const guildId = ctx.guild!.id;
        const guildData = await client.db.get(guildId);
        const isInteraction = ctx.isInteraction;
        let subCommand: string;
        let prefix: string;

        if (isInteraction) {
            subCommand = ctx.interaction.options.data[0].name;
            prefix = ctx.interaction.options.data[0].options[0]?.value.toString();
        } else {
            subCommand = args[0] || "";
            prefix = args[1] || "";
        }

        switch (subCommand) {
            case "set": {
                if (!prefix) {
                    const currentPrefix = guildData ? guildData.prefix : client.config.prefix;
                    embed.setDescription(ctx.locale("cmd.prefix.messages.current_prefix", { prefix: currentPrefix }));
                    return await ctx.sendMessage({ embeds: [embed] });
                }
                if (prefix.length > 3) {
                    embed.setDescription(ctx.locale("cmd.prefix.errors.prefix_too_long"));
                    return await ctx.sendMessage({ embeds: [embed] });
                }
                await client.db.setPrefix(guildId, prefix);
                embed.setDescription(ctx.locale("cmd.prefix.messages.prefix_set", { prefix }));
                return await ctx.sendMessage({ embeds: [embed] });
            }
            case "reset": {
                const defaultPrefix = client.config.prefix;
                await client.db.setPrefix(guildId, defaultPrefix);
                embed.setDescription(ctx.locale("cmd.prefix.messages.prefix_reset", { prefix: defaultPrefix }));
                return await ctx.sendMessage({ embeds: [embed] });
            }
            default: {
                const currentPrefix = guildData ? guildData.prefix : client.config.prefix;
                embed.setDescription(ctx.locale("cmd.prefix.messages.current_prefix", { prefix: currentPrefix }));
                return await ctx.sendMessage({ embeds: [embed] });
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
