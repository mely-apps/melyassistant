// const Discord = require("discord.js");
// const jsoning = require("jsoning");

module.exports = {
	name: "clearaskmely",
	description: "get ask mely questions",
	// args: true,
	permissions: ["ADMINISTRATOR"],
	ownerOnly: true,

	async execute(message, args) {
		const { client } = message;
		const db = client.db.askmely;
		try {
			let remove = args.length
				? (await db.has(args[0]))
					? await db.delete(args[0])
					: null
				: await db.clear();
			if (remove == null || remove == false)
				return message.reply({
					content: `${args[0]} not found`,
				});
			else if (remove === true) message.react("✅");
		} catch (error) {
			message.reply({
				content: `${error.message}`,
			});
		}
		return;
	},
};
