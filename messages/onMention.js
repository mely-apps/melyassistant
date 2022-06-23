/**
 * @file Default Bot Mention Command
 * @author Naman Vrati
 * @since 3.0.0
 */

const { prefix } = require("../config.json");

module.exports = {
	/**
	 * @description Executes when the bot is pinged.
	 * @author Naman Vrati
	 * @param {Object} message The Message Object of the command.
	 */

	async execute(message) {
		return await message.channel
			.send(
				`Hi ${message.author}! My prefix is \`${prefix}\`, get help by \`${prefix}help\``
			)
			.then((m) => {
				setTimeout(() => {
					if (m.deletable) m.delete();
				}, 30000);
			});
	},
};
