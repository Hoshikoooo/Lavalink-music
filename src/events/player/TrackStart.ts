import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    ChannelSelectMenuInteraction,
    MentionableSelectMenuInteraction,
    PermissionFlagsBits,
    RoleSelectMenuInteraction,
    StringSelectMenuInteraction,
    TextChannel,
    UserSelectMenuInteraction,
} from 'discord.js';
import { Player } from 'shoukaku';

import { Song } from '../../structures/Dispatcher.js';
import { Dispatcher, Event, Lavamusic } from '../../structures/index.js';
import { trackStart } from '../../utils/SetupSystem.js';

export default class TrackStart extends Event {
    constructor(client: Lavamusic, file: string) {
        super(client, file, {
            name: 'trackStart',
        });
    }
    public async run(player: Player, track: Song, dispatcher: Dispatcher): Promise<void> {
        const guild = this.client.guilds.cache.get(player.guildId);
        if (!guild) return;
        const channel = guild.channels.cache.get(dispatcher.channelId) as TextChannel;
        if (!channel) return;
        this.client.utils.updateStatus(this.client, guild.id);
        function buttonBuilder(): ActionRowBuilder<ButtonBuilder> {
            const previousButton = new ButtonBuilder()
                .setCustomId('previous')
                .setEmoji('⏪')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(dispatcher.previous ? false : true);
            const resumeButton = new ButtonBuilder()
                .setCustomId('resume')
                .setEmoji(player.paused ? '▶️' : '⏸️')
                .setStyle(player.paused ? ButtonStyle.Success : ButtonStyle.Secondary);
            const stopButton = new ButtonBuilder()
                .setCustomId('stop')
                .setEmoji('⏹️')
                .setStyle(ButtonStyle.Danger);
            const skipButton = new ButtonBuilder()
                .setCustomId('skip')
                .setEmoji('⏩')
                .setStyle(ButtonStyle.Secondary);
            const loopButton = new ButtonBuilder()
                .setCustomId('loop')
                .setEmoji(dispatcher.loop === 'repeat' ? '🔂' : '🔁')
                .setStyle(dispatcher.loop !== 'off' ? ButtonStyle.Success : ButtonStyle.Secondary);

            return new ActionRowBuilder<ButtonBuilder>().addComponents(
                previousButton,
                resumeButton,
                stopButton,
                skipButton,
                loopButton
            );
        }
        const embed = this.client
            .embed()
            .setAuthor({
                name: 'Now Playing',
                iconURL:
                    this.client.config.icons[track.info.sourceName] ??
                    this.client.user.displayAvatarURL({ extension: 'png' }),
            })
            .setColor(this.client.color.main)
            .setDescription(`**[${track.info.title}](${track.info.uri})**`)
            .setFooter({
                text: `Requested by ${track.info.requester.tag}`,
                iconURL: track.info.requester.avatarURL({}),
            })
            .setThumbnail(track.info.artworkUrl)
            .addFields(
                {
                    name: 'Duration',
                    value: track.info.isStream
                        ? 'LIVE'
                        : this.client.utils.formatTime(track.info.length),
                    inline: true,
                },
                { name: 'Author', value: track.info.author, inline: true }
            )
            .setTimestamp();
        let setup = await this.client.db.getSetup(guild.id);
        if (setup && setup.textId) {
            const textChannel = guild.channels.cache.get(setup.textId) as TextChannel;
            const id = setup.messageId;
            if (!textChannel) return;
            if (channel && textChannel && channel.id === textChannel.id) {
                await trackStart(id, textChannel, dispatcher, track, this.client);
            } else {
                await trackStart(id, textChannel, dispatcher, track, this.client);
            }
        } else {
            const message = await channel.send({
                embeds: [embed],
                components: [buttonBuilder()],
            });
            dispatcher.nowPlayingMessage = message;
            const collector = message.createMessageComponentCollector({
                filter: async b => {
                    if (
                        b.guild.members.me.voice.channel &&
                        b.guild.members.me.voice.channelId === b.member.voice.channelId
                    )
                        return true;
                    else {
                        b.reply({
                            content: `You are not connected to <#${
                                b.guild.members.me.voice?.channelId ?? 'None'
                            }> to use this buttons.`,
                            ephemeral: true,
                        });
                        return false;
                    }
                },
                //time: track.info.isStream ? 86400000 : track.info.length,
            });

            collector.on('collect', async interaction => {
                if (!(await checkDj(this.client, interaction))) {
                    await interaction.reply({
                        content: `You need to have the DJ role to use this command.`,
                        ephemeral: true,
                    });
                    return;
                }
                switch (interaction.customId) {
                    case 'previous':
                        if (!dispatcher.previous) {
                            await interaction.reply({
                                content: `There is no previous song.`,
                                ephemeral: true,
                            });
                            return;
                        } else dispatcher.previousTrack();
                        if (message)
                            await message.edit({
                                embeds: [
                                    embed.setFooter({
                                        text: `Previous by ${interaction.user.tag}`,
                                        iconURL: interaction.user.avatarURL({}),
                                    }),
                                ],
                                components: [buttonBuilder()],
                            });
                        break;
                    case 'resume':
                        dispatcher.pause();
                        if (message)
                            await message.edit({
                                embeds: [
                                    embed.setFooter({
                                        text: `${player.paused ? 'Paused' : 'Resumed'} by ${
                                            interaction.user.tag
                                        }`,
                                        iconURL: interaction.user.avatarURL({}),
                                    }),
                                ],
                                components: [buttonBuilder()],
                            });
                        break;
                    case 'stop':
                        dispatcher.stop();
                        if (message)
                            await message.edit({
                                embeds: [
                                    embed.setFooter({
                                        text: `Stopped by ${interaction.user.tag}`,
                                        iconURL: interaction.user.avatarURL({}),
                                    }),
                                ],
                                components: [],
                            });
                        break;
                    case 'skip':
                        if (!dispatcher.queue.length) {
                            await interaction.reply({
                                content: `There is no more song in the queue.`,
                                ephemeral: true,
                            });
                            return;
                        }
                        dispatcher.skip();
                        if (message)
                            await message.edit({
                                embeds: [
                                    embed.setFooter({
                                        text: `Skipped by ${interaction.user.tag}`,
                                        iconURL: interaction.user.avatarURL({}),
                                    }),
                                ],
                                components: [],
                            });
                        break;
                    case 'loop':
                        switch (dispatcher.loop) {
                            case 'off':
                                dispatcher.loop = 'repeat';
                                if (message)
                                    await message.edit({
                                        embeds: [
                                            embed.setFooter({
                                                text: `Looping by ${interaction.user.tag}`,
                                                iconURL: interaction.user.avatarURL({}),
                                            }),
                                        ],
                                        components: [buttonBuilder()],
                                    });
                                break;
                            case 'repeat':
                                dispatcher.loop = 'queue';
                                if (message)
                                    await message.edit({
                                        embeds: [
                                            embed.setFooter({
                                                text: `Looping Queue by ${interaction.user.tag}`,
                                                iconURL: interaction.user.avatarURL({}),
                                            }),
                                        ],
                                        components: [buttonBuilder()],
                                    });
                                break;
                            case 'queue':
                                dispatcher.loop = 'off';
                                if (message)
                                    await message.edit({
                                        embeds: [
                                            embed.setFooter({
                                                text: `Looping Off by ${interaction.user.tag}`,
                                                iconURL: interaction.user.avatarURL({}),
                                            }),
                                        ],
                                        components: [buttonBuilder()],
                                    });
                                break;
                        }
                        break;
                }
                await interaction.deferUpdate();
            });
        }
    }
}

export async function checkDj(
    client: Lavamusic,
    interaction:
        | ButtonInteraction<'cached'>
        | StringSelectMenuInteraction<'cached'>
        | UserSelectMenuInteraction<'cached'>
        | RoleSelectMenuInteraction<'cached'>
        | MentionableSelectMenuInteraction<'cached'>
        | ChannelSelectMenuInteraction<'cached'>
): Promise<boolean> {
    const dj = await client.db.getDj(interaction.guildId);
    if (dj && dj.mode) {
        const djRole = await client.db.getRoles(interaction.guildId);
        if (!djRole) return false;
        const findDJRole = interaction.member.roles.cache.find((x: any) =>
            djRole.map((y: any) => y.roleId).includes(x.id)
        );
        if (!findDJRole) {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
                return false;
            }
        } else return true;
    }
    return true;
}
/**
 * Project: lavamusic
 * Author: Appu
 * Company: Coders
 * Copyright (c) 2024. All rights reserved.
 * This code is the property of Coder and may not be reproduced or
 * modified without permission. For more information, contact us at
 * https://discord.gg/ns8CTk9J3e
 */
