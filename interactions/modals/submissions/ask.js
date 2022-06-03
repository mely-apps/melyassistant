const Discord = require("discord.js");

module.exports = {
	id: "askmely",

	async execute(interaction) {
		const { client, guild, user } = interaction;

		const question = interaction.fields.getTextInputValue("question");

		if (!question || question.length <= 0)
			return await interaction.reply({
				content: "Bạn chưa điền vào gì hết!",
				ephemeral: true,
			});

		if (
			(await require("../../../modules/submissions/askmely")(
				client,
				guild,
				user,
				question
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
	},
};
