const Discord = require("discord.js");
module.exports = {
	id: "forummodal",

	async execute(interaction) {
		const { client, guild, member, channel } = interaction;
		// console.log(channel);

		const question = interaction.fields.getTextInputValue("question");

		if (!question || question.length <= 0)
			return await interaction.reply({
				content: "Bạn chưa điền vào gì hết!",
				ephemeral: true,
			});

		try {
			channel.threads
				.create({
					name: `${TextAbstract(question, 100)}`,
					reason: `Cau hoi cua ${interaction.user}`,
				})
				.then(async (threadChannel) => {
					const Embed = [
						new Discord.MessageEmbed()
							.setDescription(question)
							.setColor("RANDOM"),
					];

					await threadChannel.send({
						content: `Câu hỏi của ${member}`,
						embeds: Embed,
					});

					await interaction.reply({
						content: "Cảm ơn bạn đã đặt câu hỏi!",
						ephemeral: true,
					});
				})
				.catch((e) => console.log(e));
		} catch (error) {
			await interaction.reply({
				content: `Đã có lỗi xảy ra...\n\`\`\`${error.message}\`\`\``,
				ephemeral: true,
			});
		}
		return;
	},
};

function TextAbstract(text, length) {
	if (text == null) {
		return "";
	}
	if (text.length <= length) {
		return text;
	}
	text = text.substring(0, length);
	last = text.lastIndexOf(" ");
	text = text.substring(0, last);
	return text + "...";
}
