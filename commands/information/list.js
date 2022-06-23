const Discord = require("discord.js");
const { owner } = require("../../config.json");
const { MessageButtonPages } = require("discord-button-page");

module.exports = {
	name: "role",
	description: "get role member status",
	args: true,
	aliases: ["list"],
	usage: "[role name]",
	// permissions: ["ADMINISTRATOR"],
	// ownerOnly: true,

	async execute(message, args) {
		const { client, guild, author } = message;

		try {
			const role = guild.roles.cache.find((r) =>
				r.name.toLowerCase().startsWith(args[0].toLowerCase())
			);

			if (!role)
				return message.reply({
					content: "Cha thay gi ca?",
				});

			const roleStatus = role.members.map(
				(m) =>
					`${genStatus(m.presence ? m.presence.status : "offline")} ${m} (${
						m.user.tag
					})`
			);

			const tempArray = [];
			while (roleStatus.length) {
				tempArray.push(roleStatus.splice(0, 20));
			}

			const pages = tempArray.map((c) =>
				new Discord.MessageEmbed()
					.setTitle(`${role.name} List (${role.members.size})`)
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
		} catch (error) {
			message.react("❌");
			const ownerUser = await client.users.fetch(owner);
			await ownerUser.send({
				content: `${author.id}: ${author.tag}\n\`\`\`${error}\`\`\``,
			});
		}
	},
};

const genStatus = (string) => {
	switch (string) {
		case "online":
			return `🟢`;
		case "offline":
			return `⚫`;
		case "dnd":
			return `🔴`;
		case "idle":
			return `🟠`;
	}
};
