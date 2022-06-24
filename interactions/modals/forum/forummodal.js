const Discord = require("discord.js");
module.exports = {
	id: "forummodal",

	async execute(interaction) {
		const { client, guild, member, channel } = interaction;
		// console.log(channel);

		const topic = interaction.fields.getTextInputValue("topic");

		if (/^ *$/.test(topic) || /^\s*$/.test(topic))
			return await interaction.reply({
				content: "Bạn chưa điền vào gì hết...",
				ephemeral: true,
			});

		const question = interaction.fields.getTextInputValue("question");

		const topicArray = topic.trim().split(/\s+/);
		const questionArray = question ? question.trim().split(/\s+/) : null;

		// console.log(question, questionArray)
		try {
			channel.threads
				.create({
					name: `${topicArray.join(" ")}`,
					reason: `Cau hoi cua ${interaction.user}`,
				})
				.then(async (threadChannel) => {
					const Embed = new Discord.MessageEmbed()
						.setTitle(topicArray.join(" "))
						.setColor("RANDOM")
						.setDescription(
							questionArray == null ? "" : questionArray.join(" ")
						)
						.setAuthor({
							name: `${member.user.tag}`,
							iconURL: member.displayAvatarURL({ dynamic: true }),
						});
					await threadChannel
						.send({
							content: `Câu hỏi của ${member}`,
							embeds: [Embed],
						})
						.then(async (m) => {
							if (m.pinnable) await m.pin();
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
