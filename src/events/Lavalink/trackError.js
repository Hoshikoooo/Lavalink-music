const { MessageEmbed } = require("discord.js");
const i18n = require("../../utils/i18n");

module.exports = async (client, player, track, payload) => {

    console.error(payload.error);

    const channel = client.channels.cache.get(player.textChannel);
    const thing = new MessageEmbed()
        .setColor("RED")
        .setDescription(i18n.__("player.track.error"));
    channel.send({embeds: [thing]});
    client.logger.log(`Error when loading song! Track is error in [${player.guild}]`, "error");
    if (!player.voiceChannel) player.destroy();

}