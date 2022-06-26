// const Discord = require("discord.js");
// const { prefix, owner, test_guild_id } = require("../config.json");
module.exports = {
	async execute(message) {
		const { client } = message;
		const actor = {
			name: message.author.tag,
			iconURL: message.author.displayAvatarURL(),
		};
		client.emit("log", "DM", message.content, actor);
	},
};
