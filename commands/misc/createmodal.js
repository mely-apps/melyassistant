const Discord = require("discord.js");

module.exports = {
	name: "createmodal",
	description: "create a modal",
	args: true,
	usage: "[channel id] [question]",
	permissions: ["ADMINISTRATOR"],
	// ownerOnly: true,

	async execute(message, args) {
		const { client, guild, member } = message;

		const channelId = client.getChannelId(args) || args.shift() || channel.id;

		const channel =
			(await guild.channels.fetch(channelId)) ||
			(await guild.channels.cache.get(channelId));

		if (!channel)
			return message.reply({
				content: "cannot find the channel",
			});

		const question = args.join(" ");

		if (question.length > 45) return message.reply({
				content: "question cannot greater than 45 characters",
			});

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
