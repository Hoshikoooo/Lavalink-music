const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "247",
  aliases: ["24h", "24/7", "24*7"],
  category: "Music",
  description: "24/7 in voice channel",
  args: false,
  usage: "",
  permission: [],
  owner: false,
  player: true,
  inVoiceChannel: true,
  sameVoiceChannel: true,
  execute: async (message, args, client, prefix) => {


    const player = message.client.manager.players.get(message.guild.id);
    if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      const embed = new MessageEmbed()
       .setColor(client.embedColor)
       .setDescription(`<247:939097896714899526> 24/7 mode turned off.`)
      return message.reply({embeds: [embed]});
    }
    else {
      player.twentyFourSeven = true;
      const embed = new MessageEmbed()
       .setColor(client.embedColor)
       .setDescription(`<247:939097896714899526> 24/7 mode turned on.`)
      
      return message.reply({embeds: [embed]});
    }
  }
};