const Discord = require("discord.js");

module.exports = {
	name: "summon",
	description: "Summon things",
	args: true,
	ownerOnly: true,

	async execute(message, args) {
		const { guild } = message;

		const Embed = new Discord.EmbedBuilder()
			.setColor("Blurple")
			.setTitle("Kiểm soát cách nhận thông báo")
			.setDescription(
				"Bạn có thể lựa chọn các loại thông báo bạn muốn nhận!\nHãy nhấn vào các nút tương ứng để nhận thông báo bạn mong muốn bên dưới!"
			);

		const components = (state) => [
			new Discord.ActionRowBuilder().addComponents(
				new Discord.ButtonBuilder()
					.setCustomId("announcements")
					.setDisabled(state)
					.setLabel("Chung")
					.setStyle(ButtonStyle.Secondary),
				new Discord.ButtonBuilder()
					.setCustomId("events")
					.setDisabled(state)
					.setLabel("Sự kiện")
					.setStyle(ButtonStyle.Secondary),
				new Discord.ButtonBuilder()
					.setCustomId("updates")
					.setDisabled(state)
					.setLabel("Cập nhật")
					.setStyle(ButtonStyle.Secondary)
			),
		];

		const channelId = client.getChannelId(args) || args.shift() || channel.id;

		const channel =
			(await guild.channels.fetch(channelId)) ||
			(await guild.channels.cache.get(channelId));
            
		if (!channel)
			return message.reply({
				content: "cannot find the channel",
			});

		channel
			.send({
				embeds: [Embed],
				components: components(false),
			})
			.then(() => {
				message.react("✅")
			})
			.catch((e) => {
				message.reply({
					content: e.message,
				});
			});
	},
};
