const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	PermissionFlagsBits,
	ModalBuilder,
	TextInputBuilder,
	ActionRowBuilder,
    TextInputStyle,
} = require("discord.js");

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName("replyasme")
		.setType(ApplicationCommandType.Message)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	/**
	 *
	 * @param {import('discord.js').MessageContextMenuCommandInteraction} interaction
	 * @returns
	 */
	async execute(interaction) {
		const contentInput = new ActionRowBuilder().addComponents(
			new TextInputBuilder()
				.setCustomId("content")
				.setLabel(
					`What to reply to ${interaction.targetMessage.author.username}?`
				)
				.setStyle(TextInputStyle.Paragraph)
		);

		const modal = new ModalBuilder()
			.setCustomId("repasme")
			.setTitle(`Reply`)
			.addComponents(contentInput);

		await interaction.showModal(modal);

		await interaction
			.awaitModalSubmit({
				filter: () => (interaction) => interaction.customId === "repasme",
				time: 60_000,
			})
			.then(async (awaitInteraction) => {
				const content = awaitInteraction.fields.getTextInputValue("content");

				await interaction.targetMessage.reply({
					content: `${content}`,
				});

				await awaitInteraction.reply({
					content: "Replied!",
                    ephemeral: true
				});
                
                console.log(`${interaction.user.id} replied to ${interaction.targetMessage.guildId}/${interaction.targetMessage.channelId}/${interaction.targetId}: ${content}`)
			})
			.catch(console.error);

		return;
	},
};
