const Discord = require("discord.js");
const { MessageButtonPages } = require("discord-button-page");

module.exports = {
	name: "thanklist",
	aliases: [
		"thankslist",
		"thankslb",
		"thanksleaderboard",
		"thankstop",
		"tkstop",
		"tkslb",
		"tkslist",
		"tksls",
	],
	description: "get mely thank points list",

	async execute(message, args) {
		const { client, guild, author } = message;
		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("thankPoint"))) return;

		const thankTable = client.db.table("thanks");
		const thanksArray = (await thankTable.all())
			.map((key) => [key.id, key.value.length])
			.filter((key) => key[1] > 0)
			.sort((a, b) => b[1] - a[1]);

		const thankContentArray = thanksArray.map((e) => {
			if (guild.members.cache.has(e[0])) {
				const mem = guild.members.cache.get(e[0]);
				return `${mem} (${mem.user.tag}): ${e[1]}`;
			}
		});

		const tempArray = [];

		while (thankContentArray.length) {
			tempArray.push(thankContentArray.splice(0, 20));
		}

		const pages = await tempArray.map((c) =>
			new Discord.MessageEmbed()
				.setTitle("REPLIERS")
				.setColor("RANDOM")
				.setDescription(`${c.join("\n")}`)
		);

		if (!pages.length)
			return message.reply({
				content: "Cha thay gi ca?",
			});

		if (pages.length < 2)
			return message.reply({
				embeds: pages,
			});

		const embedPages = new MessageButtonPages()
			.setDuration(300000)
			.setEmbeds(pages)
			.setReply(true);

		await embedPages.build(message);
	},
};
