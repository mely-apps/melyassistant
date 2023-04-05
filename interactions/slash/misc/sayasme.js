const Discord = require("discord.js");
const {
	SlashCommandBuilder,
	ButtonStyle,
	ChannelType,
	PermissionFlagsBits,
	SlashCommandChannelOption,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("sayasme")
		.setDescription("Like its name")
		.addStringOption((option) =>
			option.setName("content").setDescription("What to say?").setRequired(true)
		)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("Channel to send")
				.addChannelTypes(
					ChannelType.GuildText,
					ChannelType.GuildVoice,
					ChannelType.PublicThread,
					ChannelType.PrivateThread
				)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	/**
	 *
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const { client, guild } = interaction;
		const content = interaction.options.getString("content");
		const channel =
			interaction.options.getChannel("channel") || interaction.channel;
            
		await channel.sendTyping();

		setTimeout(() => {
			(async () => {
				await channel.send({
					content: `${content}`,
				});
			})();
		}, content.length * 10);

		await interaction.reply({
			content: `Sent!\n${Discord.codeBlock(content)}`,
			ephemeral: true,
		});

		console.log(
			`${interaction.user.id} sent to ${guild.id}/${channel.id}: ${content}`
		);
	},
};
