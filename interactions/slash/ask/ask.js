// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("ask")
		.setDescription("Hỏi MeLy một câu")
		.addStringOption((option) =>
			option
				.setName("question")
				.setDescription("Điền câu hỏi bạn muốn hỏi MeLy")
		)
		.addBooleanOption((option) =>
			option
				.setName("anonymous")
				.setDescription("Ẩn danh (Không áp dụng trong điền form)")
		),

	async execute(interaction) {
		const question = interaction.options.getString("question");
		if (question) {
			const { client, guild, user } = interaction;
			const anonymous = interaction.options.getBoolean("anonymous");
			if (
				(await require("../../../modules/submissions/askmely")(
					client,
					guild,
					user,
					question,
					anonymous
				)) != -1
			)
				await interaction.reply({
					content: "Cảm ơn bạn đã đặt câu hỏi!",
					ephemeral: true,
				});
			else
				await interaction.reply({
					content: "Đã có lỗi xảy ra...",
					ephemeral: true,
				});
			return;
		}

		const modal = new Discord.Modal()
			.setCustomId("askmely")
			.setTitle("Hỏi MeLy đi!");

		const questionInput = new Discord.TextInputComponent()
			.setCustomId("question")
			.setLabel("Câu hỏi của bạn là gì?")
			.setStyle("PARAGRAPH");

		const questionRow = new Discord.MessageActionRow().addComponents(
			questionInput
		);

		modal.addComponents(questionRow);

		await interaction.showModal(modal);
	},
};
