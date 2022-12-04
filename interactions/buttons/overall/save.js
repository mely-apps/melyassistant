const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
	id: "save",
	async execute(interaction) {
		const { client, guild, message } = interaction;

		await interaction.deferReply({ ephemeral: true });

		try {
			const row = [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setLabel("Đi tới tin nhắn")
						.setStyle("LINK")
						.setURL(message.url)
				),
			];

			await interaction.user.send({
				content: message.content,
				components: row,
			});

			return interaction.editReply({
				content: "Đã lưu!",
			});
		} catch (error) {
			await interaction.editReply({
				content:
					"Đã có lỗi xảy ra, vui lòng báo cho admin!\n```" +
					error.message +
					"```",
			});
		}
	},
};
