const { MessageEmbed } = require("discord.js");

module.exports = {
  	name: "remove",
    category: "Music",
  	description: "Remove song from the queue",
	  args: true,
    usage: "<Number of song in queue>",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
	 execute: async (message, args, client, prefix) => {
  
		const player = client.manager.get(message.guild.id);

        if (!player.queue.current) {
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("<:err:935798200869208074> There is no music playing.");
            return message.reply({embeds: [thing]});
        }

    const position = (Number(args[0]) - 1);
       if (position > player.queue.size) {
        const number = (position + 1);
         let thing = new MessageEmbed()
            .setColor("RED")
            .setDescription(`<:err:935798200869208074> There are no songs at number ${number}!`);
            return message.reply({embeds: [thing]});
        }

    const song = player.queue[position]
		player.queue.remove(position);

		const emojieject = client.emoji.remove;

		let thing = new MessageEmbed()
			.setColor(client.embedColor)
			.setTimestamp()
			.setDescription(`${emojieject} **Removed song from queue**\n[${song.title}](${song.uri})`)
		  return message.reply({embeds: [thing]});
	
    }
};