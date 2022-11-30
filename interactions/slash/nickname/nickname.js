const Discord = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nickname")
		.setDescription("Gửi yêu cầu đổi tên đến ban quản trị")
		.addStringOption((option) =>
			option
				.setName("new")
				.setDescription("Nickname mong muốn")
				.setRequired(true)
		),
	modules: ["nickname"],

	async execute(interaction) {
		const { client, guild, member } = interaction;

		const settingsTable = client.db.table("settings");
		if (!(await settingsTable.has("nickname")))
			return interaction.reply({
				content: `You cannot do this by now`,
				ephemeral: true,
			});

		const nickSubId = await settingsTable.get("nickname");
		if (!guild.channels.cache.some((c) => c.id == nickSubId))
			return interaction.reply({
				content: `You cannot do this by now`,
				ephemeral: true,
			});

		const nickSubC = await guild.channels.fetch(nickSubId);

		const Embed = new Discord.MessageEmbed()
			.setAuthor({
				name: member.user.tag,
				iconURL: member.displayAvatarURL(),
			})
			.setTitle("Nickname Request")
			.setColor("RANDOM")
			.addField("ID", interaction.user.id)
			.addField("Old", client.displayName(member))
			.addField("New", interaction.options.getString("new"));

		const components = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("nick-a")
					.setDisabled(state)
					.setLabel("Approve")
					.setStyle("SUCCESS"),
				new Discord.MessageButton()
					.setCustomId("nick-d")
					.setDisabled(state)
					.setLabel("Decline")
					.setStyle("DANGER")
			),
		];

		try {
			nickSubC.send({
				embeds: [Embed],
				components: components(false),
			});
			interaction.reply({
				content: `Yêu cầu của bạn đã được gửi đi! Vui lòng đợi các QTV duyệt!`,
				ephemeral: true,
			});
		} catch (error) {
			interaction.reply({
				content: `Đã có lỗi xảy ra! Hãy báo cho QTV!\n\`${error.message}\``,
				ephemeral: true,
			});
		}
	},
};
