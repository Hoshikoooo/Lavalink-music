import { TextChannel } from 'discord.js';

import { Lavamusic } from '../structures/index.js';

export default class BotLog {
    public static send(
        client: Lavamusic,
        message: string,
        type: 'error' | 'warn' | 'info' | 'success' = 'info'
    ): void {
        if (!client || !client.channels.cache || !client.config.logChannelId) return;

        const channel = client.channels.cache.get(client.config.logChannelId) as TextChannel;
        if (!channel) return;

        const colors: { [key: string]: number } = {
            error: 0xff0000,
            warn: 0xffff00,
            info: 0x00ff00,
            success: 0x00ff00,
        };
        const color = colors[type] || 0x000000;

        const embed = client.embed().setColor(color).setDescription(message).setTimestamp();

        channel.send({ embeds: [embed] }).catch(() => {});
    }
}
