/**
 * @file Dynamic help command
 * @author Naman Vrati
 * @since 1.0.0
 */

// Deconstructing prefix from config file to use in help command
const { prefix } = require("./../../config.json");

// Deconstructing EmbedBuilder to create embeds within this command
const { EmbedBuilder } = require("discord.js");

module.exports = {
	name: "help",
	description: "List all commands of bot or info about a specific command.",
	aliases: ["commands"],
	usage: "[command name]",
	cooldown: 5,

	/**
	 * @description Executes when the command is called by command handler.
	 * @author Naman Vrati
	 * @param {Object} message The Message Object of the command.
	 * @param {String[]} args The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
	 */

	execute(message, args) {
		const { commands } = message.client;

		// If there are no args, it means it needs whole help command.

		if (!args.length) {
			/**
			 * @type {Object}
			 * @description Help command embed object
			 */

			let helpEmbed = new EmbedBuilder()
				.setColor(0x4286f4)
				.setURL(process.env.URL)
				.setTitle("Help Panel")
				.setDescription(
					`\`#\` before command is owner only\n\`*\` after command is arguments required`
				)
				.addFields([
					{
						name: `Commands`,
						value:
							"`" +
							commands
								.map(
									(command) =>
										`${command.ownerOnly ? "#" : ""}${command.name}${
											command.args ? "*" : ""
										}`
								)
								.join("`, `") +
							"`",
						inline: false,
					},
					{
						name: `Usage`,
						value: `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`,
						inline: false,
					},
				]);

			// Attempts to send embed in DMs.

			return message.reply({ embeds: [helpEmbed] });
		}

		// If argument is provided, check if it's a command.

		/**
		 * @type {String}
		 * @description First argument in lower case
		 */

		const name = args[0].toLowerCase();

		/**
		 * @type {Object}
		 * @description The command object
		 */

		const command =
			commands.get(name) ||
			commands.find((c) => c.aliases && c.aliases.includes(name));

		// If it's an invalid command.

		if (!command) {
			return message.reply({ content: "That's not a valid command!" });
		}

		/**
		 * @type {Object}
		 * @description Embed of Help command for a specific command.
		 */

		let commandEmbed = new EmbedBuilder()
			.setColor(0x4286f4)
			.setTitle("Command Help");

		if (command.description)
			commandEmbed.setDescription(`${command.description}`);

		if (command.aliases)
			commandEmbed.addFields([
				{
					name: "Aliases",
					value: `\`${command.aliases.join(", ")}\``,
					inline: true,
				},
				{
					name: "Cooldown",
					value: `${command.cooldown || 3} second(s)`,
					inline: true,
				},
			]);
		if (command.usage)
			commandEmbed.addFields([
				{
					name: "Usage",
					value: `\`${prefix}${command.name} ${
						!command.options ? "" : `[${command.options.join("|")}] `
					}${command.usage}\``,
					inline: true,
				},
			]);

		// Finally send the embed.

		message.reply({ embeds: [commandEmbed] });
	},
};
