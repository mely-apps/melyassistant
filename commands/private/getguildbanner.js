const Discord = require("discord.js");

module.exports = {
	name: "getgb",
	description: "get guild banner",
	// args: true,
	ownerOnly: true,

	async execute(message, args) {
		const { client, guild, member } = message;
		const fetchedGuild = await guild.fetch();
		const bannerURL = await fetchedGuild.bannerURL();

		message.reply({
			content: `${bannerURL}`,
		});
	},
};
