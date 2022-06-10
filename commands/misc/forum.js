const Discord = require("discord.js");

module.exports = {
	name: "forum",
	description: "set, get, delele forum channel",
	args: true,
	ownerOnly: true,
	options: ["delete", "set", "get"],
	usage: "[set|get|delete] <channel ID>",

	async execute(message, args) {
		const { client, channel, guild } = message;

		const option = args.shift();

		switch (option) {
			case "get":
				message.reply({
					content: `Channel: ${await client.db.global.get(
						"forumChannel"
					)}\nPanel: ${await client.db.forum.get("panel")}`,
				});
				break;
			case "set":
				const channelId = args.shift() || channel.id;
				const isChannelExist = guild.channels.cache.some(
					(c) => c.id == channelId
				);

				if (!isChannelExist)
					return message.reply({
						content: "Not exist channel",
					});

				await client.db.global.set("forumChannel", channelId);

				const Embed = new Discord.MessageEmbed()
					.setColor("RANDOM")
					.setTitle("HỎI ĐÁP")
					.setDescription("Bạn muốn tạo chủ đề hỏi đáp?\nClick nút ở dưới!");

				const row = [
					new Discord.MessageActionRow().addComponents(
						new Discord.MessageButton()
							.setCustomId("forum")
							.setDisabled(false)
							.setStyle("SUCCESS")
							.setLabel("ĐẶT CÂU HỎI")
							.setEmoji("❓")
					),
				];

				const channelSet =
					(await guild.channels.fetch(
						await client.db.global.get("forumChannel")
					)) || null;

				if (channelSet == null)
					return message.reply({
						content: `Channel: ${channelSet}`,
					});

				const msg = await channelSet.send({
					embeds: [Embed],
					components: row,
				});

				await client.db.forum.set("panel", msg.id);

				return message.reply({
					content: `Channel: ${channelSet}\nPanel: ${msg.url}`,
				});
			case "delete":
				try {
					const channelDelete =
						(await client.db.global.get("forumChannel")) != null
							? (await guild.channels.fetch(
									await client.db.global.get("forumChannel")
							  )) || null
							: null;

					if (channelDelete == null)
						return message.reply({
							content: `Channel: ${await client.db.global.delete(
								"forumChannel"
							)}\nPanel: ${await client.db.forum.delete("panel")}`,
						});

					const panelDelete =
						(await client.db.forum.get("panel")) != null
							? (await channelDelete.messages.fetch(
									await client.db.forum.get("panel")
							  )) || null
							: null;

					if (panelDelete == null)
						return message.reply({
							content: `Channel: ${await client.db.global.delete(
								"forumChannel"
							)}\nPanel: ${await client.db.forum.delete("panel")}`,
						});

					if (panelDelete.deletable) await panelDelete.delete();

					return message.reply({
						content: `Channel: ${await client.db.global.delete(
							"forumChannel"
						)}\nPanel: ${await client.db.forum.delete("panel")}`,
					});
				} catch (error) {
					return message.reply({
						content: `Channel: ${await client.db.global.delete(
							"forumChannel"
						)}\nPanel: ${await client.db.forum.delete("panel")}\n\`\`\`${
							error.message
						}\`\`\``,
					});
				}
		}
	},
};
