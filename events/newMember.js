const { test_guild_id } = require("../config.json");

module.exports = {
	name: "guildMemberAdd",

	async execute(member, client) {
		const { guild } = member;
		if (guild.id != test_guild_id) return;

		const moduleTable = client.db.table("module");
		if (await moduleTable.get("greeting"))
			require("../messages/welcomeMessageMeLy").execute(member);
	},
};
