const Discord = require("discord.js");

module.exports = {
	name: "mely",
	aliases: ["guide", "hd", "huongdan"],
	description: "get mely guide",

	async execute(message, args) {
		const { client, guild } = message;

		const Embed = await require("../../constants/embeds/guide")(guild);

		await message
			.reply({
				embeds: [Embed],
			})
			.then(async (msg) => {
				setTimeout(async () => {
					if (msg && msg.deletable) await msg.delete();
					if (message && message.deletable) await message.delete();
				}, 60000);
			})
			.catch(console.error);
	},
};
