module.exports = {
	id: "tksselect",

	async execute(interaction) {
		await interaction.deferUpdate();
		const { client, values, message } = interaction;
		const db = client.db.table("thanks");
		const replierId = values.shift();
		const embed = message.embeds.shift();
		const args = embed.description.trim().split(/ +/);
		const data = {
			fromId: interaction.user.id,
			threadId: getChannelId(args),
			timestamp: Date.now(),
		};
		await db.push(replierId, data);
		client.actionlog(
			"+thankPoint",
			`From ${interaction.user.id} to ${replierId}`
		);
		await interaction.editReply({
			content: "Cảm ơn bạn!",
			embeds: [],
			components: [],
		});
		return;
	},
};

function getChannelId(args) {
	var id, matches;
	args.forEach((element, index) => {
		if (index > 0 && id) return;
		matches = element.match(/^<#?(\d+)>$/);
		if (!matches) return;
		return (id = matches[1]);
	});
	return id;
}
