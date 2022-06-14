const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("mely")
		.setDescription("Hiện bảng hướng dẫn!"),

	async execute(interaction) {
		const { guild } = interaction;

		const Embed = await require("../../../constants/embeds/guide")(guild);

		return await interaction.reply({
			embeds: [Embed],
			ephemeral: true,
		});
	},
};
