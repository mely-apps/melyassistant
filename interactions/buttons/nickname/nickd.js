const Discord = require("discord.js");

module.exports = {
	id: "nick-d",
	// permissions: ["MANAGE_NICKNAMES"],
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

		const reqDecReasonInput = new Discord.TextInputBuilder()
			.setCustomId("reason")
			// The label is the prompt the user sees for this input
			.setLabel("Lý do từ chối")
			// Short means only a single line of text
			.setStyle(Discord.TextInputStyle.Paragraph);

		const reqDecReasonRow = new Discord.ActionRowBuilder().addComponents(
			reqDecReasonInput
		);

		const modal = new Discord.ModalBuilder()
			.setCustomId("nick-r")
			.setTitle("Nickname Decline Reason")
			.addComponents(reqDecReasonRow);

		await interaction.showModal(modal);

		const filter = (i) =>
			i.customId === "nick-r" && i.user.id === interaction.user.id;

		interaction
			.awaitModalSubmit({ filter, time: 300_000 })
			.then(async (replyInteraction) => {
				const reqMem = await interaction.guild.members.fetch(reqId);
				const reason = replyInteraction.fields.getTextInputValue("reason");

				const decline_embed = new Discord.EmbedBuilder()
					.setTitle(`Nickname Request Declined (${reqId})`)
					.setColor("Red")
					.addFields([
						{
							name: `Changed for`,
							value: reqMem.user.tag,
						},
						{
							name: `From`,
							value: reqOldNick,
						},
						{
							name: `To`,
							value: reqNewNick,
						},
						{
							name: "Reason",
							value: reason.length == 0 ? "None" : reason,
						},
					])
					.setFooter({
						text: `Declined by ${replyInteraction.user.tag}`,
					});

				replyInteraction.update({
					embeds: [decline_embed],
					components: [],
				});

				reqMem
					.send({
						content: `❌ ${client.displayName(
							member
						)} đã từ chối yêu cầu đổi tên của bạn.${
							reason.length == 0 ? "" : `\n**Lý do**: \`\`\`${reason}\`\`\``
						}`,
					})
					.catch((e) => {
						if (e.message)
							replyInteraction.followUp({
								content: `${e.message}`,
								ephemeral: true,
							});

						console.error("[Nick Decline User DM]", e);
					});
			})
			.catch((error) => {
				if (error.message)
					interaction.followUp({
						content: `${error.message}`,
						ephemeral: true,
					});
				console.error("[Nick Decline]", error);
			});
		// console.log(reqId, reqOldNick, reqNewNick);
	},
};
