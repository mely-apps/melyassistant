const Discord = require("discord.js");

module.exports = {
	name: "mythanks",
	aliases: ["thanks"],
	description: "get mely your thank points",

	async execute(message, args) {
		const { client, guild, author } = message;
		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("thankPoint"))) return;

		const thankTable = client.db.table("thanks");

		if (
			!(await thankTable.has(author.id)) ||
			((await thankTable.has(author.id)) &&
				(await thankTable.get(author.id)).length < 1)
		)
			return message
				.reply({
					content: `Bạn chưa có điểm nào :< Hãy tích cực thu thập điểm bằng cách giúp đỡ trong <#975409529204375653> nhé!`,
				})
				.then((m) => {
					setTimeout(() => {
						if (m.deletable) m.delete();
					}, 30000);
				});

		return message
			.reply({
				content: `Bạn hiện có \`${
					(await thankTable.get(author.id)).length
				}\` điểm!`,
			})
			.then((m) => {
				setTimeout(() => {
					if (m.deletable) m.delete();
				}, 30000);
			});
	},
};
