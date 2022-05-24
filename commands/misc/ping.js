const Discord = require("discord.js");
module.exports = {
	name: "ping",

	/** You need to uncomment below properties if you need them. */
	//description: 'Ping!',
	//usage: 'put usage here',
	//permissions: 'SEND_MESSAGES',
	//guildOnly: true,

	/**
	 * @description Executes when the command is called by command handler.
	 * @author Naman Vrati
	 * @param {Object} message The Message Object of the command.
	 * @param {String[]} args The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
	 */

	execute(message, args) {
		const { client } = message;

		let totalSeconds = client.uptime / 1000;
		let days = Math.floor(totalSeconds / 86400);
		totalSeconds %= 86400;
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = Math.floor(totalSeconds % 60);
		let uptime = `${days > 0 ? `${days} day${days > 1 ? "s" : ""}, ` : ""}${
			hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}, ` : ""
		}${minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}, ` : ""}${
			seconds > 0 ? `${seconds} second${seconds > 1 ? "s" : ""}` : ""
		}`;

		const Embed = new Discord.MessageEmbed()
			// .setTitle("🏓 Pong!")
			.setColor("RANDOM")
			.addField("Online", "```" + uptime + "```")
			.addField(
				"API Latency",
				"```" + Math.round(client.ws.ping) + "ms" + "```",
				true
			)
			.addField(
				"Client Latency",
				"```" +
					Math.round(Date.now() - message.createdTimestamp) +
					"ms" +
					"```",
				true
			);
		return message.reply({
			embeds: [Embed],
		});
	},
};
