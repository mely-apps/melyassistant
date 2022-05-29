const Discord = require("discord.js");

module.exports = {
	name: "rolebot",
	description: "add all bots to role bots",
	// args: true,
	ownerOnly: true,

	async execute(message, args) {
		const { guild } = message;

		const guildMembers = await guild.members.fetch();
		const bots = await guildMembers.filter((m) => m.user.bot);

		const botRole =
			(await guild.roles.cache.find((r) => r.name.toLowerCase() == "bots")) ||
			(await guild.roles.create({
				name: "bots",
				reason: "role to add all bots in",
			}));

		try {
			bots.forEach(async (bot) => {
				await bot.roles.add(botRole);
			});

			return message.reply({
				content: "Done",
			});
		} catch (error) {
			message.reply({
				content: error.message,
			});
		}
	},
};
