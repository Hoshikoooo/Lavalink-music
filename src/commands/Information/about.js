const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

module.exports = {
    name: "about",
    category: "Information",
    aliases: [ "botinfo" ],
    description: "See description about this project",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {
     
    const row = new MessageActionRow()
			.addComponents(
    new MessageButton()
    .setLabel("Invite")
    .setStyle("LINK")
    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=36768832&scope=applications.commands%20bot`),
    new MessageButton()
    .setLabel("GitHub")
    .setStyle("LINK")
    .setURL("https://github.com/brblacky/lavamusic"),
    new MessageButton()
    .setLabel("Support")
    .setStyle("LINK")
    .setURL("https://discord.gg/gfcv94hDhv")
			);

      const mainPage = new MessageEmbed()
            .setAuthor({ name: 'LavaMusic', iconURL: 'https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png'})
            .setThumbnail('https://media.discordapp.net/attachments/876035356460462090/888434725235097610/20210820_124325.png')
            .setColor('#303236')
            .addField('Creator', '[Blacky#6618](https://github.com/brblacky), [Venom#9718](https://github.com/Venom9718/), [AkAbhijit#6892](https://github.com/AkAbhijit#6892/)', true)
            .addField('Organization', '[Blacky](https://github.com/brblacky)', true)
            .addField('Repository', '[Here](https://github.com/brblacky/lavamusic)', true)
            .addField('\u200b',
                `[LavaMusic](https://github.com/brblacky/lavamusic/) is [Blacky](https://github.com/brblacky) and [Venom](https://github.com/Venom9718)'s Was created by blacky and Venom. He really wants to make his first open source project ever. Because he wants more for coding experience. In this project, he was challenged to make project with less bugs. Hope you enjoy using LavaMusic!`
            )
        return message.reply({embeds: [mainPage], components: [row]});
    }
}
