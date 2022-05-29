const Discord = require("discord.js");

module.exports = {
	name: "createmodal",
	description: "add all bots to role bots",
	args: true,
	permissions: ["ADMINISTRATOR"],
	// ownerOnly: true,

	async execute(message, args) {
		const { client, guild, member } = message;

		const channelId = args.shift()

		const channel =
			(await guild.channels.fetch(channelId)) ||
			(await guild.channels.cache.get(channelId));

		if (!channel)
			return message.reply({
				content: "cannot find the channel",
			});

		const question = args.join(" ");

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setDescription(question)
			.setFooter({
				text: "Nhấn nút ĐIỀN ở dưới để điền đơn",
			});

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("createmodal")
					.setStyle("SECONDARY")
					.setLabel("ĐIỀN")
					.setDisabled(state)
			),
		];

		return channel
			.send({
				embeds: [Embed],
				components: components(false),
			})
			.then(() => {
				message.reply({
					content: `Sent to ${channel}`,
				});
			})
			.catch((e) => {
				message.reply({
					content: e.message,
				});
			});
	},
};
