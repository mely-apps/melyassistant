const { owner, test_guild_id } = require("../config.json");

module.exports = {
	name: "messageCreate",
	// skip: true,
	async execute(message) {
		const { client, guild, channel, content, author } = message;

		if (!guild || guild == null) return;

		if (guild.id != test_guild_id) return;

		if (!channel.name.toLowerCase().includes("giới-thiệu-bản-thân")) return;

		if (content.length < 100) return;

		return message
			.startThread({
				name: "Trả lời " + author.username,
			})
			.catch((e) => console.log(e));
	},
};
