const Discord = require("discord.js");

module.exports = {
	name: "threadReply",
	description: "set, get, delele auto thread reply channel",
	args: true,
	ownerOnly: true,
	options: ["pull", "push", "get"],
	usage: "<channel ID>",

	async execute(message, args) {
		const { client, channel, guild } = message;

		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("threadReply"))) return;

		const option = args.shift();
		const db = client.db.table("settings");
		const channelId = client.getChannelId(args) || args.shift() || channel.id;

		switch (option) {
			case "get":
				if (!(await db.has("threadReply")))
					return message.reply({
						content: "Not exist",
					});
				const channels = await db.get("threadReply");
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

				await db.push("threadReply", channelId);

				return message.reply({
					content: `Pushed <#${channelId}>`,
				});

			case "pull":
				if (!(await db.has("threadReply")))
					return message.reply({
						content: "Not exist",
					});
				await db.pull("threadReply", channelId);
				message.reply({
					content: `Pulled <#${channelId}>`,
				});
				break;
		}
	},
};
