const Discord = require("discord.js");

module.exports = {
	id: "createmodal",
	async execute(interaction) {
		const { client, guild, message } = interaction;

		// console.log(message.embeds[0].description);

		const modal = new Discord.Modal()
			.setCustomId("generalmodal")
			.setTitle("MELY FORM");

		const questionInput = new Discord.TextInputComponent()
			.setCustomId("embedquestion")
			.setLabel(message.embeds[0].description)
			.setStyle("PARAGRAPH");

		const questionRow = new Discord.MessageActionRow().addComponents(
			questionInput
		);

		modal.addComponents(questionRow);

		await interaction.showModal(modal)
		// await interaction.update();
	},
};
