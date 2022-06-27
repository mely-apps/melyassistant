const Discord = require("discord.js");

module.exports = {
	name: "emore",
	description: "set, get, delele auto emojies react channel",
	args: true,
	ownerOnly: true,
	options: ["pull", "push", "get"],
	usage: "<channel ID>",

	async execute(message, args) {
		const { client, channel, guild } = message;

		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("emore"))) return;

		const option = args.shift();
		const db = client.db.table("settings");
		const channelId = args.shift() || channel.id;

		switch (option) {
			case "get":
				if (!(await db.has("emore")))
					return message.reply({
						content: "Not exist",
					});
				const channels = await db.get("emore");
				message.reply({
					content: `Channels: ${
						!channels.length ? "Empty" : `<#${channels.join(">, <#")}>`
					}`,
				});
				break;
			case "push":
				const isChannelExist = guild.channels.cache.some(
					(c) => c.id == channelId
				);

				if (!isChannelExist)
					return message.reply({
						content: "Not exist channel",
					});

				await db.push("emore", channelId);

				return message.reply({
					content: `Pushed <#${channelId}>`,
				});

			case "pull":
				if (!(await db.has("emore")))
					return message.reply({
						content: "Not exist",
					});
				await db.pull("emore", channelId);
				message.reply({
					content: `Pulled <#${channelId}>`,
				});
				break;
		}
	},
};
