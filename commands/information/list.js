const Discord = require("discord.js");

module.exports = {
	name: "role",
	description: "get role member status",
	args: true,
	aliases: ['list'],
	usage: "[role name]",
	// permissions: ["ADMINISTRATOR"],
	// ownerOnly: true,

	async execute(message, args) {
		const { guild } = message;

		const role = guild.roles.cache.find((r) =>
			r.name.toLowerCase().startsWith(args[0].toLowerCase())
		);

		const description = role.members
			.map(
				(m) => `${genStatus(m.presence ? m.presence.status : "offline")} ${m}`
			)
			.join("\n");

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(`${role.name} List (${role.members.size})`)
			.setDescription(description);

		return message.reply({
			embeds: [Embed],
		});
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
