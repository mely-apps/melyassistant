const Discord = require("discord.js");

module.exports = {
	name: "test",
	description: "add all bots to role bots",
	// args: true,
	ownerOnly: true,

	async execute(message, args) {
		const { client, guild, member } = message;

		const thanks = client.db.table("thanks")
		await thanks.deleteAll()
	},
};
