const Discord = require("discord.js");

module.exports = {
	name: "drop",
	description: "Summon things",
	args: true,
	ownerOnly: true,
	
	async execute(message, args) {
		const { guild } = message;

		const Embed = new Discord.MessageEmbed()
			.setColor("BLURPLE")
			.setTitle("Kiểm soát cách nhận thông báo")
			.setDescription(
				"Bạn có thể lựa chọn các loại thông báo bạn muốn nhận!\nHãy chọn các loại tên thông báo tương ứng bạn muốn nhận bên dưới!"
			);

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId("pingdrop")
					.setPlaceholder("Chọn loại thông báo bạn muốn nhận...")
					.setDisabled(state)
					.setMaxValues(3)
					.setMinValues(0)
					.addOptions({
						label: "Chung",
						value: "announcements",
						description: "Nhận thông báo chung từ MeLy!",
					})
					.addOptions({
						label: "Sự kiện",
						value: "events",
						description:
							"Nhận thông báo về các sự kiện tại Code Mely!",
					})
					.addOptions({
						label: "Cập nhật",
						value: "updates",
						description:
							"Nhận thông báo về những thay đổi tại máy chủ Code Mely!",
					})
			),
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("suball")
					.setDisabled(state)
					.setLabel("Chọn tất cả")
					.setStyle("PRIMARY"),
				new Discord.MessageButton()
					.setCustomId("unsuball")
					.setDisabled(state)
					.setLabel("Hủy chọn tất cả")
					.setStyle("DANGER")
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
				message.reply({
					content: "Sent!",
				});
			})
			.catch((e) => {
				message.reply({
					content: e.message,
				});
			});
	},
};
