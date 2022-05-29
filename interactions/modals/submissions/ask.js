const Discord = require("discord.js");

module.exports = {
	id: "askmely",

	async execute(interaction) {
		const { client, guild, member } = interaction;

		const submissionChannel = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("ask-mely")
		);

		const question = interaction.fields.getTextInputValue("question");

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle("ASK MELY")
			.setAuthor({
				name: member.user.tag,
				iconURL: member.user.displayAvatarURL({ dynamic: true }),
			})
			.setDescription(question)
			.setFooter({
				text: member.user.id,
			});

		await submissionChannel.send({
			embeds: [Embed],
		});

		await interaction.reply({
			content: "Cảm ơn bạn đã đặt câu hỏi!",
			ephemeral: true,
		});
		return;
	},
};
