import { ActionRowBuilder, ButtonBuilder, ButtonStyle, type EmojiIdentifierResolvable } from "discord.js";
import type { Dispatcher, Lavamusic } from "../structures/index.js";

function getButtons(player: Dispatcher, client: Lavamusic): ActionRowBuilder<ButtonBuilder>[] {
    const buttonData = [
        { customId: "REWIND_BUT", emoji: client.emoji.replay, style: ButtonStyle.Secondary },
        { customId: "LOW_VOL_BUT", emoji: client.emoji.voldown, style: ButtonStyle.Secondary },
        { customId: "STOP_BUT", emoji: client.emoji.stop, style: ButtonStyle.Danger },
        { customId: "HIGH_VOL_BUT", emoji: client.emoji.volup, style: ButtonStyle.Secondary },
        { customId: "FORWARD_BUT", emoji: client.emoji.forward, style: ButtonStyle.Secondary },
        { customId: "PREV_BUT", emoji: client.emoji.previous, style: ButtonStyle.Secondary },
        { customId: "LOOP_BUT", emoji: client.emoji.loop.none, style: ButtonStyle.Secondary },
        {
            customId: "PAUSE_BUT",
            emoji: player?.paused ? client.emoji.resume : client.emoji.pause,
            style: player?.paused ? ButtonStyle.Success : ButtonStyle.Secondary,
        },
        { customId: "SHUFFLE_BUT", emoji: client.emoji.shuffle, style: ButtonStyle.Secondary },
        { customId: "SKIP_BUT", emoji: client.emoji.skip, style: ButtonStyle.Secondary },
    ];

    return buttonData.reduce((rows, { customId, emoji, style }, index) => {
        if (index % 5 === 0) rows.push(new ActionRowBuilder<ButtonBuilder>());

        let emojiFormat: EmojiIdentifierResolvable;
        if (typeof emoji === "string" && emoji.startsWith("<:")) {
            // Custom emoji with ID format (e.g., <:emojiName:123456789012345678>)
            const match = emoji.match(/^<:\w+:(\d+)>$/);
            emojiFormat = match ? match[1] : emoji;
        } else {
            emojiFormat = emoji;
        }

        const button = new ButtonBuilder().setCustomId(customId).setEmoji(emojiFormat).setStyle(style);
        rows[rows.length - 1].addComponents(button);
        return rows;
    }, [] as ActionRowBuilder<ButtonBuilder>[]);
}

export { getButtons };
