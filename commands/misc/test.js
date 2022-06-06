const Discord = require("discord.js");

module.exports = {
	name: "test",
	description: "add all bots to role bots",
	// args: true,
	ownerOnly: true,

	async execute(message, args) {
		const { client, guild, member } = message;

		const channels = await guild.channels.fetch();
		const categories = channels
			.filter(
				(c) =>
					c.type == "GUILD_CATEGORY" && c.name.toLowerCase().includes("học")
			)
			.map((c) => c.id);

		console.log(categories);
	},
};
