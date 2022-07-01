const { owner, test_guild_id } = require("../config.json");

module.exports = {
	name: "messageCreate",
	// skip: true,
	async execute(message) {
		const { client, guild, channel, content, author } = message;
		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("threadReply"))) return;

		if (!guild || guild == null) return;

		if (guild.id != test_guild_id) return;

		const db = client.db.table("settings");

		if (!(await db.has("threadReply"))) return;

		if (!(await db.get("threadReply")).includes(channel.id)) return;

		// if (!channel.name.toLowerCase().includes("giới-thiệu-bản-thân")) return;

		if (content.length < 50) return;

		return message
			.startThread({
				name: "Trả lời " + author.username,
			})
			.catch((e) => console.log(e));
	},
};
