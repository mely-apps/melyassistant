const Discord = require("discord.js");
module.exports = {
	async execute(message) {
		const { client } = message;
		const owner = await client.users.fetch(owner);
		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: `${message.author}`,
				iconURL: message.author.displayAvatarURL(),
			})
			.setDescription(`${message.content}`)
			.setFooter({
				text: message.author.id,
			});

		return owner.send({
			embeds: [Embed],
		});
	},
};
