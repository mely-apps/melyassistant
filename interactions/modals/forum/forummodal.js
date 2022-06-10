const Discord = require("discord.js");
module.exports = {
	id: "forummodal",

	async execute(interaction) {
		const { client, guild, member, channel } = interaction;
		// console.log(channel);

		const question = interaction.fields.getTextInputValue("question");

		if (/^ *$/.test(question) || /^\s*$/.test(question))
			return await interaction.reply({
				content: "Bạn chưa điền vào gì hết...",
				ephemeral: true,
			});

		const questionArray = question.trim().split(/\s+/);

		try {
			channel.threads
				.create({
					name: `${questionArray.join(" ")}`,
					reason: `Cau hoi cua ${interaction.user}`,
				})
				.then(async (threadChannel) => {
					const Embed = [
						new Discord.MessageEmbed()
							.setTitle(questionArray.join(" "))
							.setColor("RANDOM")
							.setAuthor({
								name: `${member.user.tag}`,
								iconURL: member.displayAvatarURL({ dynamic: true }),
							}),
					];

					await threadChannel.send({
						content: `Câu hỏi của ${member}`,
						embeds: Embed,
					});

					await interaction.reply({
						content: `Câu hỏi của bạn đã được gửi đến ${threadChannel}!`,
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
