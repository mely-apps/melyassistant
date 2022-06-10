const detectLang = require("lang-detector");

module.exports = {
	data: {
		name: "Code gì zãy?",
		type: 3, // 3 is for message context menus
	},

	async execute(interaction) {
		const { client, channel, targetId } = interaction;
        const message = await channel.messages.fetch(targetId)

        if (!message.content || message.content.length === 0) {
			return await interaction.reply({
				content: `Không có gì ở đây hết...`,
				ephemeral: true,
			});
		}

        const lang = await detectLang(message.content)

		await interaction.reply({
			content: lang != "Unknown" ? `Là **${lang}** phải không?` : `Không biết là gì luôn...`,
			ephemeral: true,
		});
		return;
	},
};
