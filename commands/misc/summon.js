const Discord = require("discord.js");

module.exports = {
	name: "summon",
	description: "Summon things",
	args: true,
	ownerOnly: true,

	async execute(message, args) {
		const { guild } = message;

		const Embed = new Discord.MessageEmbed()
			.setColor("BLURPLE")
			.setTitle("Kiểm soát cách nhận thông báo")
			.setDescription(
				"Bạn có thể lựa chọn các loại thông báo bạn muốn nhận!\nHãy nhấn vào các nút tương ứng để nhận thông báo bạn mong muốn bên dưới!"
			);

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("announcements")
					.setDisabled(state)
					.setLabel("Chung")
					.setStyle("SECONDARY"),
				new Discord.MessageButton()
					.setCustomId("events")
					.setDisabled(state)
					.setLabel("Sự kiện")
					.setStyle("SECONDARY"),
				new Discord.MessageButton()
					.setCustomId("updates")
					.setDisabled(state)
					.setLabel("Cập nhật")
					.setStyle("SECONDARY")
			),
		];

		const channelId = args[0];

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
