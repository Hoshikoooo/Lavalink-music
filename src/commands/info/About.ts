import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class About extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "about",
            description: {
                content: "cmd.about.description",
                examples: ["about"],
                usage: "about",
            },
            category: "info",
            aliases: ["ab"],
            cooldown: 3,
            args: false,
            player: {
                voice: false,
                dj: false,
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
        const inviteButton = new ButtonBuilder()
            .setLabel(ctx.locale("buttons.invite"))
            .setStyle(ButtonStyle.Link)
            .setURL(
                `https://discord.com/api/oauth2/authorize?client_id=${client.config.clientId}&permissions=8&scope=bot%20applications.commands`,
            );
        const supportButton = new ButtonBuilder()
            .setLabel(ctx.locale("buttons.support"))
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/ns8CTk9J3e");
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(inviteButton, supportButton);
        const embed = this.client
            .embed()
            .setAuthor({
                name: "Lavamusic",
                iconURL: "https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png",
            })
            .setThumbnail("https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png")
            .setColor(this.client.color.main)
            .addFields(
                {
                    name: ctx.locale("cmd.about.fields.creator"),
                    value: "[appujet](https://github.com/appujet)",
                    inline: true,
                },
                {
                    name: ctx.locale("cmd.about.fields.repository"),
                    value: "[Here](https://github.com/appujet/lavamusic)",
                    inline: true,
                },
                {
                    name: ctx.locale("cmd.about.fields.support"),
                    value: "[Here](https://discord.gg/ns8CTk9J3e)",
                    inline: true,
                },
                {
                    name: "\u200b",
                    value: ctx.locale("cmd.about.fields.description"),
                    inline: true,
                },
            );
        await ctx.sendMessage({
            content: "",
            embeds: [embed],
            components: [row],
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
