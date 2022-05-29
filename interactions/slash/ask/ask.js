// Deconstructed the constants we need in this file.

const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("ask")
		.setDescription(
			"Hỏi MeLy một câu"
		),
		// .addStringOption((option) =>
		// 	option
		// 		.setName("command")
		// 		.setDescription("The specific command to see the info of.")
		// ),

	async execute(interaction) {
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
