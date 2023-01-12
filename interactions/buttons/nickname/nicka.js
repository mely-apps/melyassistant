const Discord = require("discord.js");

module.exports = {
	id: "nick-a",
	async execute(interaction) {
		const { guild, message, member, client } = interaction;

		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("nickname")))
			return interaction.reply({
				content: `You cannot do this by now`,
				ephemeral: true,
			});

		const settingsTable = client.db.table("settings");
		if (!(await settingsTable.has("nickname")))
			return interaction.reply({
				content: `You cannot do this by now`,
				ephemeral: true,
			});

		if (!member.permissions.has(Discord.PermissionFlagsBits.ManageNicknames))
			return interaction.reply({
				content: `You dont have the required right to do that.`,
				ephemeral: true,
			});

		const reqEmbed = message.embeds.shift();
		const reqId = reqEmbed.fields.find((f) => f.name === "ID")["value"];
		const reqNewNick = reqEmbed.fields.find((f) => f.name === "New")["value"];
		const reqOldNick = reqEmbed.fields.find((f) => f.name === "Old")["value"];

		const reqMember = await guild.members.fetch(reqId);

		reqMember
			.setNickname(reqNewNick)
			.then((member) => {
				member.send({
					content: `✅ ${client.displayName(
						member
					)} đã chấp nhận yêu cầu đổi tên của bạn.`,
				});

				const accecpt_embed = new Discord.EmbedBuilder()
					.setTitle(`Nickname Request Approved (${reqId})`)
					.setColor("Green")
					.addFields([
						{
							name: `Changed for`,
							value: reqMember.user.tag,
						},
						{
							name: `From`,
							value: reqOldNick,
						},
						{
							name: `To`,
							value: reqNewNick,
						},
					])
					.setFooter({
						text: `Approved by ${interaction.user.tag}`,
					});

				interaction.update({
					embeds: [accecpt_embed],
					components: [],
				});
			})
			.catch((error) => {
				interaction.reply({
					content: `\`\`\`${error}\`\`\``,
					ephemeral: true,
				});
			});
	},
};
