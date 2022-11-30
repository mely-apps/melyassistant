const { Events } = require("discord.js");
const { prefix, owner, test_guild_id } = require("../config.json");

module.exports = {
	name: Events.MessageCreate,

	async execute(message) {
		const { client, guild, channel, content, author } = message;
		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("emore"))) return;
		if (author.bot) return;

		if (!guild || guild == null) return;

		if (guild.id != test_guild_id) return;

		const db = client.db.table("settings");

		if (!(await db.has("emore"))) return;

		if (!(await db.get("emore")).includes(channel.id)) return;

		let emojies = await guild.emojis.fetch();
		emojies = await emojies.filter((e) => e.available);
		const emojiAmount = Math.floor(Math.random() * (10 - 5) + 5);

		for (let i = 0; i < emojiAmount; i++) {
			let emoji = await emojies.random();
			await message.react(emoji);
		}
	},
};
