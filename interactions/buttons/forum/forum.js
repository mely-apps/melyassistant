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

		const topicInput = new Discord.TextInputComponent()
			.setCustomId("topic")
			.setRequired(true)
			.setMinLength(10)
			.setMaxLength(100)
			.setPlaceholder("Điền chủ đề...")
			.setLabel("Chủ đề cần hỏi")
			.setStyle("SHORT");

		const questionInput = new Discord.TextInputComponent()
			.setCustomId("question")
			.setRequired(false)
			.setPlaceholder("Điền câu hỏi...")
			.setLabel("Câu hỏi")
			.setStyle("PARAGRAPH");

		const topicRow = new Discord.MessageActionRow().addComponents(topicInput);

		const questionRow = new Discord.MessageActionRow().addComponents(
			questionInput
		);

		modal.addComponents(topicRow, questionRow);

		await interaction.showModal(modal);
		// await interaction.update();
	},
};
