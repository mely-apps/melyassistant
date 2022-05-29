const Discord = require("discord.js");

module.exports = {
	id: "generalmodal",

	async execute(interaction) {
		const { client, guild, member } = interaction;

		const submissionChannel = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("submissions")
		);

        // console.log(interaction.components[0])

		const question = interaction.fields.getTextInputValue("embedquestion");

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
            .setTitle(interaction.message.embeds[0].description)
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
			content: "Cảm ơn bạn đã gửi đơn!",
			ephemeral: true,
		});
		return;
	},
};
