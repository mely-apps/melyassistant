/**
 * @file Message Based Commands Handler
 * @author Naman Vrati
 * @since 1.0.0
 */

// Declares constants (destructured) to be used in this file.

const { Collection, DMChannel, Events, ChannelType } = require("discord.js");
const { prefix, owner } = require("../config.json");

// Prefix regex, we will use to match in mention prefix.

const escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = {
	name: Events.MessageCreate,

	async execute(message) {
		const { client, guild, channel, content, author } = message;

		console.log(message);

		if (message.author.bot) return;

		if (
			channel.type === ChannelType.DM ||
			channel.type === ChannelType.GroupDM
		) {
			console.log(message);
			return require("../messages/dmMessage").execute(message);
		}

		if (
			message.content == `<@${client.user.id}>` ||
			message.content == `<@!${client.user.id}>`
		) {
			require("../messages/onMention").execute(message);
			return;
		}

		const checkPrefix = prefix.toLowerCase();

		const prefixRegex = new RegExp(
			`^(<@!?${client.user.id}>|${escapeRegex(checkPrefix)})\\s*`
		);

		// Checks if message content in lower case starts with bot's mention.

		if (!prefixRegex.test(content.toLowerCase())) return;

		/**
		 * @description Checks and returned matched prefix, either mention or prefix in config.
		 */

		const [matchedPrefix] = content.toLowerCase().match(prefixRegex);

		/**
		 * @type {String[]}
		 * @description The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
		 */

		const args = content.slice(matchedPrefix.length).trim().split(/ +/);

		/**
		 * @type {String}
		 * @description Name of the command received from first argument of the args array.
		 */

		const commandName = args.shift().toLowerCase();

		// Check if mesage does not starts with prefix, or message author is bot. If yes, return.

		if (!message.content.startsWith(matchedPrefix) || message.author.bot)
			return;

		/**
		 * @description The message command object.
		 * @type {Object}
		 */

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			);

		// It it's not a command, return :)

		if (!command) return;

		// Owner Only Property, add in your command properties if true.

		if (command.ownerOnly && message.author.id !== owner) {
			return message.reply({ content: "This is a owner only command!" });
		}

		// Guild Only Property, add in your command properties if true.

		if (command.guildOnly && message.channel.type === ChannelType.DM) {
			return message.reply({
				content: "I can't execute that command inside DMs!",
			});
		}

		// Author perms property

		if (command.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return message.reply({
					content: "You don't have the right to do this!",
				});
			}
		}

		// Args missing

		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${
					!command.options ? "" : `[${command.options.join("|")}] `
				}${command.usage}\``;
			}

			if (command.options && command.options.length > 0) {
				let options = command.options
					.map((o) => `${prefix}${command.name} ${o.toLowerCase()}`)
					.join("\n");

				reply += `\n\`\`\`Example:\n${options}\`\`\``;
				// `\n\`\`\`Usage:\n${options}\`\`\``;
			}

			return message.channel.send({ content: reply });
		}

		// missing options
		if (
			command.args &&
			args.length &&
			command.options &&
			command.options.length > 0
		) {
			let options = command.options
				.map((o) => `${prefix}${command.name} ${o.toLowerCase()}`)
				.join("\n");
			let reply = `Wrong input option.\nThe proper usage would be: \`${prefix}${
				command.name
			} [${command.options.join("|")}] ${
				command.usage
			}\`\n\`\`\`Usage:\n${options}\`\`\``;
			if (!command.options.includes(args[0]))
				return message.reply({ content: reply });
		}

		// Cooldowns

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply({
					content: `please wait ${timeLeft.toFixed(
						1
					)} more second(s) before reusing the \`${command.name}\` command.`,
				});
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		// Rest your creativity is below.

		// execute the final command. Put everything above this.
		try {
			command.execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply({
				content: "There was an error trying to execute that command!",
			});

			const ownerUser = await client.users.fetch(owner);
			await ownerUser.send({
				content: `${author.id}: ${author.tag}\n\`\`\`${error}\`\`\``,
			});
		}
	},
};
