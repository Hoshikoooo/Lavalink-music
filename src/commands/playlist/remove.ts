import { LoadType } from "shoukaku";
import { Command, type Context, type Lavamusic } from "../../structures/index.js";

export default class RemoveSong extends Command {
    constructor(client: Lavamusic) {
        super(client, {
            name: "remove",
            description: {
                content: "Removes a song from the playlist",
                examples: ["remove <playlist> <song>"],
                usage: "remove <playlist> <song>",
            },
            category: "playlist",
            aliases: ["remove"],
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
                user: [],
            },
            slashCommand: true,
            options: [
                {
                    name: "playlist",
                    description: "The playlist you want to remove from",
                    type: 3,
                    required: true,
                },
                {
                    name: "song",
                    description: "The song you want to remove",
                    type: 3,
                    required: true,
                },
            ],
        });
    }

    public async run(client: Lavamusic, ctx: Context, args: string[]): Promise<any> {
        const playlist = args.shift();
        const song = args.join(" ");

        if (!playlist) {
            const errorMessage = this.client.embed().setDescription("[Please provide a playlist]").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        if (!song) {
            const errorMessage = this.client.embed().setDescription("[Please provide a song]").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [errorMessage] });
        }

        const playlistData = await client.db.getPlaylist(ctx.author.id, playlist);

        if (!playlistData) {
            const playlistNotFoundError = this.client.embed().setDescription("[That playlist doesn't exist]").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [playlistNotFoundError] });
        }

        const res = await client.queue.search(song);

        if (!res || res.loadType !== 'track') {
            const noSongsFoundError = this.client.embed().setDescription("[No matching song found]").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [noSongsFoundError] });
        }

        const trackToRemove = res.data;
        console.log(`Track to remove: ${JSON.stringify(trackToRemove)}`);

        try {
            // Remove the track from the playlist
            await client.db.removeSong(ctx.author.id, playlist, trackToRemove.encoded);

            const successMessage = this.client
                .embed()
                .setDescription(`[Removed ${trackToRemove.info.title} from ${playlistData.name}]`)
                .setColor(this.client.color.green);
            ctx.sendMessage({ embeds: [successMessage] });
        } catch (error) {
            console.error(error);
            const genericError = this.client.embed().setDescription("[An error occurred while removing the song]").setColor(this.client.color.red);
            return await ctx.sendMessage({ embeds: [genericError] });
        }
    }
}