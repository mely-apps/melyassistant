const { test_guild_id } = require("../config.json");

module.exports = {
	name: "guildMemberAdd",

	async execute(member) {
		const { guild } = member;
		if (guild.id != test_guild_id) return;
		else require("../messages/welcomeMessageMeLy").execute(member);
	},
};
