const Discord = require("discord.js");

module.exports = {
	name: "drop",
	description: "Summon things",
	args: true,
	ownerOnly: true,
	
	async execute(message, args) {
		const { guild } = message;

		const Embed = new Discord.EmbedBuilder()
			.setColor("Blurple")
			.setTitle("Kiểm soát cách nhận thông báo")
			.setDescription(
				"Bạn có thể lựa chọn các loại thông báo bạn muốn nhận!\nHãy chọn các loại tên thông báo tương ứng bạn muốn nhận bên dưới!"
			);

		const components = (state) => [
			new Discord.ActionRowBuilder().addComponents(
				new Discord.StringSelectMenuBuilder()
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
			new Discord.ActionRowBuilder().addComponents(
				new Discord.ButtonBuilder()
					.setCustomId("suball")
					.setDisabled(state)
					.setLabel("Chọn tất cả")
					.setStyle(ButtonStyle.Primary),
				new Discord.ButtonBuilder()
					.setCustomId("unsuball")
					.setDisabled(state)
					.setLabel("Hủy chọn tất cả")
					.setStyle(ButtonStyle.Danger)
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
