const Discord = require("discord.js");
const { MessageButtonPages } = require("discord-button-page");

module.exports = {
	name: "detailtkslist",
	aliases: ["detailthanklist", "dtkslist", "dtksls"],
	// args: true,
	description: "get mely thank points list",
	usage: "<memberId>",
	permissions: ["ADMINISTRATOR"],

	async execute(message, args) {
		const { client, guild, author } = message;

		const thankTable = client.db.table("thanks");
		let thanksArray = !args.length
			? await thankTable.all()
			: (await thankTable.get(args[0])) || null;

		if (thanksArray == null)
			return message.reply({
				content: "Cai j z?",
			});

		const thankContentArray = !args.length
			? thanksArray
					.map((d) =>
						d.value.map((v) => {
							return `\`${v.fromId}\`➡\`${d.id}\`❔\`${v.threadId}\`🕒\`${v.timestamp}\``;
						})
					)
					.flat()
					.filter((v) => typeof v !== "undefined")
			: thanksArray.map((e) => {
					return `\`${e.fromId}\`❔\`${e.threadId}\`🕒\`${e.timestamp}\``;
			  });

		const tempArray = [];

		while (thankContentArray.length) {
			tempArray.push(thankContentArray.splice(0, 20));
		}

		const pages = tempArray.map((c) =>
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

		embedPages.build(message);
	},
};
