const Discord = require("discord.js");
const { isNormalTextChannel } = require("../../modules/util/validate");

module.exports = {
	name: "nicksub",
	description: "set, get, delele nickname submissions channel",
	args: true,
	ownerOnly: true,
	options: ["delete", "set", "get"],
	usage: "<channel>",

	async execute(message, args) {
		const { client, channel, guild } = message;

		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("nickname"))) return;

		const option = args.shift();
		const db = client.db.table("settings");

		switch (option) {
			case "get":
				if (!(await db.has("nickname")))
					return message.reply({
						content: `Nickname submissions channel is not exist`,
					});

				message.reply({
					content: `NickSub: <#${await db.get("nickname")}>`,
				});
				break;
			case "set":
				const channelId =
					client.getChannelId(args) || args.shift() || channel.id;
				// console.log(channelId);
				const isChannelExist = guild.channels.cache.some(
					(c) => c.id == channelId
				);

				if (!isChannelExist)
					return message.reply({
						content: "Not exist channel",
					});

				const channelSet = (await guild.channels.fetch(channelId)) || null;

				if (channelSet == null)
					return message.reply({
						content: `Cannot fetch that channel`,
					});

				if (!isNormalTextChannel(channelSet))
					return message.reply({
						content: `Get a normal text channel!`,
					});

				await db.set("nickname", channelSet.id);

				return message.reply({
					content: `NickSub channel is set to ${channelSet}`,
				});
			case "delete":
				if (!(await db.has("nickname")))
					return message.reply({
						content: `Nickname submissions channel is not exist`,
					});
				try {
					const status = await db.delete("nickname");

					await message.reply({
						content: `Success: ${status}`,
					});
					return;
				} catch (error) {
					await message.reply({
						content: `\n\`\`\`${error.message}\`\`\``,
					});
				}
				break;
		}
	},
};
