const { prefix, owner, test_guild_id } = require("../config.json");

module.exports = {
	name: "messageCreate",

	async execute(message) {
		const { client, guild, channel, content, author } = message;

		if (author.bot) return;

		if (!guild || guild == null) return;

		if (guild.id != test_guild_id) return;

		if (channel.id != "853907347994837012") return;

		let emojies = await guild.emojis.fetch();
		emojies = await emojies.filter((e) => e.available);
		const emojiAmount = Math.floor(Math.random() * (10 - 5) + 5);
		
		for (let i = 0; i < emojiAmount; i++) {
			let emoji = await emojies.random();
			await message.react(emoji);
		}
	},
};
