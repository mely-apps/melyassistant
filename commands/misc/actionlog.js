const Discord = require("discord.js");

module.exports = {
	name: "actionlog",
	description: "set, get, delele actionlog channel",
	args: true,
	ownerOnly: true,
	options: ["delete", "set", "get", "test"],
	usage: "<channel ID>",

	async execute(message, args) {
		const { client, channel, guild } = message;

		const option = args.shift();
		const db = client.db.table("settings");

		switch (option) {
			case "get":
				if (!(await db.has("actionWebhookURL")))
					return message.reply({
						content: `Actionlog channel is not exist`,
					});

				message.reply({
					content: `webhookURL: ${await db.get("actionWebhookURL")}`,
				});
				break;
			case "set":
				const channelId =
					client.getChannelId(args) || args.shift() || channel.id;
				console.log(channelId);
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

				if (!channelSet.isText() || channelSet.isThread())
					return message.reply({
						content: `Get a normal text channel!`,
					});
				const webhooks = (await channelSet.fetchWebhooks()).filter(
					(w) => w.owner.id == client.user.id
				);

				const webhook = webhooks.size
					? webhooks.first()
					: await channelSet.createWebhook(client.user.username);

				await db.set("actionWebhookURL", webhook.url);

				return message.reply({
					content: `Action log is set to ${channelSet}`,
				});
			case "delete":
				if (!(await db.has("actionWebhookURL")))
					return message.reply({
						content: `Actionlog channel is not exist`,
					});
				try {
					const status = await db.delete("actionWebhookURL");

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
			case "test":
				if (!(await db.has("actionWebhookURL")))
					return message.reply({
						content: `Actionlog channel is not exist`,
					});

				const actionWebhookURL = await db.get("actionWebhookURL");
				const webhookClient = new Discord.WebhookClient({
					url: actionWebhookURL,
				});
				await webhookClient.send({
					content: !args.length ? "Test" : args.join(" "),
				});
				client.actionlog("test")
				message.reply({
					content: `Sent test!`,
				});
				break;
		}
	},
};
