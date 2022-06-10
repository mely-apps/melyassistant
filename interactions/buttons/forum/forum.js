const Discord = require("discord.js");

module.exports = {
	id: "forum",
	async execute(interaction) {
		const { client, guild, message } = interaction;

		// message.channel.threads
		// 	.create({
		// 		name: `Cau hoi cua ${interaction.user.username}`,
		// 		autoArchiveDuration: 60,
		// 		reason: `${interaction.user} dat cau hoi`,
		// 	})
		// 	.catch(console.error);

		// console.log(message.embeds[0].description);

		const modal = new Discord.Modal()
			.setCustomId("forummodal")
			.setTitle("HỎI ĐÁP");

		const questionInput = new Discord.TextInputComponent()
			.setCustomId("question")
			.setRequired(true)
			.setMinLength(10)
			.setMaxLength(100)
			.setPlaceholder("Câu hỏi của bạn...")
			.setLabel("Bạn hãy điền câu hỏi muốn hỏi phía dưới!")
			.setStyle("SHORT");

		const questionRow = new Discord.MessageActionRow().addComponents(
			questionInput
		);

		modal.addComponents(questionRow);

		await interaction.showModal(modal)
		// await interaction.update();
	},
};
