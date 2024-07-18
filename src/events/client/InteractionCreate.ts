import {
    type AutocompleteInteraction,
    ChannelType,
    Collection,
    CommandInteraction,
    type GuildMember,
    InteractionType,
    PermissionFlagsBits,
} from "discord.js";
import { LoadType } from "shoukaku";
import { Context, Event, type Lavamusic } from "../../structures/index.js";

export default class InteractionCreate extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: "interactionCreate",
        });
    }

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    public async run(interaction: CommandInteraction | AutocompleteInteraction): Promise<any> {
        if (interaction instanceof CommandInteraction && interaction.isCommand()) {
            const setup = await this.client.db.getSetup(interaction.guildId);
            const allowedCategories = ["filters", "music", "playlist"];
            const commandInSetup = this.client.commands.get(interaction.commandName);

            if (
                setup &&
                interaction.channelId === setup.textId &&
                !(commandInSetup && allowedCategories.includes(commandInSetup.category))
            ) {
                return await interaction.reply({
                    content: `You can't use this command in setup channel.`,
                    ephemeral: true,
                });
            }

            const { commandName } = interaction;
            await this.client.db.get(interaction.guildId);
            const locale = await this.client.db.getLanguage(interaction.guildId);
            const command = this.client.commands.get(commandName);
            if (!command) return;

            const ctx = new Context(interaction as any, interaction.options.data as any);
            ctx.setArgs(interaction.options.data as any);
            ctx.guildLocale = locale;
            const clientMember = interaction.guild.members.resolve(this.client.user);
            if (!(interaction.inGuild() && interaction.channel.permissionsFor(clientMember)?.has(PermissionFlagsBits.ViewChannel))) return;

            if (!clientMember.permissions.has(PermissionFlagsBits.SendMessages)) {
                return await (interaction.member as GuildMember)
                    .send({
                        content: `I don't have **\`SendMessage\`** permission in \`${interaction.guild.name}\`\nchannel: <#${interaction.channelId}>.`,
                    })
                    .catch(() => {});
            }

            if (!clientMember.permissions.has(PermissionFlagsBits.EmbedLinks)) {
                return await interaction.reply({
                    content: "I don't have **`EmbedLinks`** permission.",
                });
            }

            if (command.permissions) {
                if (command.permissions.client && !clientMember.permissions.has(command.permissions.client)) {
                    return await interaction.reply({
                        content: "I don't have enough permissions to execute this command.",
                    });
                }

                if (command.permissions.user && !(interaction.member as GuildMember).permissions.has(command.permissions.user)) {
                    await interaction.reply({
                        content: "You don't have enough permissions to use this command.",
                        ephemeral: true,
                    });
                    return;
                }

                if (command.permissions.dev && this.client.config.owners) {
                    const isDev = this.client.config.owners.includes(interaction.user.id);
                    if (!isDev) return;
                }
            }

            if (command.player) {
                if (command.player.voice) {
                    if (!(interaction.member as GuildMember).voice.channel) {
                        return await interaction.reply({
                            content: `You must be connected to a voice channel to use this \`${command.name}\` command.`,
                        });
                    }

                    if (!clientMember.permissions.has(PermissionFlagsBits.Connect)) {
                        return await interaction.reply({
                            content: `I don't have \`CONNECT\` permissions to execute this \`${command.name}\` command.`,
                        });
                    }

                    if (!clientMember.permissions.has(PermissionFlagsBits.Speak)) {
                        return await interaction.reply({
                            content: `I don't have \`SPEAK\` permissions to execute this \`${command.name}\` command.`,
                        });
                    }

                    if (
                        (interaction.member as GuildMember).voice.channel.type === ChannelType.GuildStageVoice &&
                        !clientMember.permissions.has(PermissionFlagsBits.RequestToSpeak)
                    ) {
                        return await interaction.reply({
                            content: `I don't have \`REQUEST TO SPEAK\` permission to execute this \`${command.name}\` command.`,
                        });
                    }

                    if (
                        clientMember.voice.channel &&
                        clientMember.voice.channelId !== (interaction.member as GuildMember).voice.channelId
                    ) {
                        return await interaction.reply({
                            content: `You are not connected to <#${clientMember.voice.channelId}> to use this \`${command.name}\` command.`,
                        });
                    }
                }

                if (command.player.active) {
                    const queue = this.client.queue.get(interaction.guildId);
                    if (!(queue?.queue && queue.current)) {
                        return await interaction.reply({
                            content: "Nothing is playing right now.",
                        });
                    }
                }

                if (command.player.dj) {
                    const dj = await this.client.db.getDj(interaction.guildId);
                    if (dj?.mode) {
                        const djRole = await this.client.db.getRoles(interaction.guildId);
                        if (!djRole) {
                            return await interaction.reply({
                                content: "DJ role is not set.",
                            });
                        }

                        const hasDJRole = (interaction.member as GuildMember).roles.cache.some((role) =>
                            djRole.map((r) => r.roleId).includes(role.id),
                        );
                        if (!(hasDJRole && !(interaction.member as GuildMember).permissions.has(PermissionFlagsBits.ManageGuild))) {
                            return await interaction.reply({
                                content: "You need to have the DJ role to use this command.",
                                ephemeral: true,
                            });
                        }
                    }
                }
            }

            if (!this.client.cooldown.has(commandName)) {
                this.client.cooldown.set(commandName, new Collection());
            }

            const now = Date.now();
            const timestamps = this.client.cooldown.get(commandName)!;
            const cooldownAmount = (command.cooldown || 5) * 1000;

            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id)! + cooldownAmount;
                const timeLeft = (expirationTime - now) / 1000;
                if (now < expirationTime && timeLeft > 0.9) {
                    return await interaction.reply({
                        content: `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${commandName}\` command.`,
                    });
                }
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            } else {
                timestamps.set(interaction.user.id, now);
                setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            }

            try {
                const _reply = await command.run(this.client, ctx, ctx.args);
                if (setup && interaction.channelId === setup.textId && allowedCategories.includes(command.category)) {
                    setTimeout(() => {
                        (interaction as CommandInteraction).deleteReply().catch(() => {});
                    }, 5000);
                }
            } catch (error) {
                this.client.logger.error(error);
                await interaction.reply({
                    content: `An error occurred: \`${error}\``,
                });
            }
        } else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            if (interaction.commandName === "play" || interaction.commandName === "playnext") {
                const song = interaction.options.getString("song");
                const res = await this.client.queue.search(song);
                const songs = [];

                if (res.loadType === LoadType.SEARCH && res.data.length) {
                    res.data.slice(0, 10).forEach((x) => {
                        songs.push({
                            name: `${x.info.title} by ${x.info.author}`,
                            value: x.info.uri,
                        });
                    });
                }

                return await interaction.respond(songs).catch(() => {});
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
