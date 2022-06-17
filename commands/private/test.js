const Discord = require("discord.js");

module.exports = {
	name: "test",
	description: "add all bots to role bots",
	// args: true,
	ownerOnly: true,

	async execute(message, args) {
		const { client, guild, member } = message;

		message.reply({
			content: `${client.string.removeZalgo(args.join(" "))}\nfull zalgo: ${client.string.isFullofZalgo(args.join(" "))}\nhas zalgo: ${client.string.validateZalgo(args.join(" "))}`,
		});
	},
};
