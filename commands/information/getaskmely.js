// const Discord = require("discord.js");
// const jsoning = require("jsoning");

module.exports = {
	name: "getaskmely",
	description: "get ask mely questions",
	// args: true,
	permissions: ["ADMINISTRATOR"],
	// ownerOnly: true,

	async execute(message, args) {
		const { client } = message;
		const db = client.db.askmely
		try {
			let questions = args.length
				? (await db.has(args[0]))
					? await db.get(args[0])
					: null
				: await db.all();
			let content = questions == null ? "None" : JSON.stringify(questions);

			message.reply({
				content: `${content}`,
			});
		} catch (error) {
			message.reply({
				content: `${error.message}`,
			});
		}
		return;
	},
};
