const { ButtonStyle } = require("discord.js");
const Discord = require("discord.js");
const { isNormalTextChannel } = require("../../modules/util/validate");

module.exports = {
	name: "forum",
	description: "set, get, delele forum channel",
	args: true,
	ownerOnly: true,
	options: ["delete", "set", "get"],
	usage: "<channel ID>",

	async execute(message, args) {
		const { client, channel, guild } = message;

		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("forum"))) return;

		const option = args.shift();
		const db = client.db.table("settings");

		switch (option) {
			case "get":
				if (!(await db.has("forum")) || !(await db.has("forum.id")))
					return message.reply({
						content: `Forum channel is not exist`,
					});

				message.reply({
					content: `Channel: <#${await db.get(
						"forum.id"
					)}>\nPanelId: ${await db.get("forum.panelId")}`,
				});
				break;
			case "set":
				const channelId =
					client.getChannelId(args) || args.shift() || channel.id;
				const isChannelExist = guild.channels.cache.some(
					(c) => c.id == channelId
				);

				if (!isChannelExist)
					return message.reply({
						content: "Not exist channel",
					});

				const Embed = new Discord.EmbedBuilder()
					.setColor("Random")
					.setTitle("HỎI ĐÁP")
					.setDescription("Bấm nút dưới và đặt câu hỏi");

				const row = [
					new Discord.ActionRowBuilder().addComponents(
						new Discord.ButtonBuilder()
							.setCustomId("forum")
							.setDisabled(false)
							.setStyle(ButtonStyle.Success)
							.setLabel("ĐẶT CÂU HỎI")
							.setEmoji("❔")
					),
				];

				const channelSet = (await guild.channels.fetch(channelId)) || null;

				if (channelSet == null)
					return message.reply({
						content: `Channel: <#${channelSet}>`,
					});

				if (
					!isNormalTextChannel(channelSet)
				)
					return message.reply({
						content: `Get a normal text channel!`,
					});

				const msg = await channelSet.send({
					embeds: [Embed],
					components: row,
				});

				await db.set("forum", { id: channelId, panelId: msg.id });

				return message.reply({
					content: `Channel: ${channelSet}\nPanelURL: ${msg.url}`,
				});
			case "delete":
				if (!(await db.has("forum")) || !(await db.has("forum.id")))
					return message.reply({
						content: `Forum channel is not exist`,
					});
				try {
					const channelDelete =
						(await db.get("forum.id")) != null
							? (await guild.channels.fetch(await db.get("forum.id"))) || null
							: null;

					if (channelDelete == null)
						return message.reply({
							content: `Channel: ${await db.delete(
								"forum.id"
							)}\nPanel: ${await db.delete("forum.panelId")}`,
						});

					const panelDelete =
						(await db.get("forum.panelId")) != null
							? (await channelDelete.messages.fetch(
									await db.get("forum.panelId")
							  )) || null
							: null;

					if (panelDelete == null)
						return message.reply({
							content: `Channel: ${await db.delete(
								"forum.id"
							)}\nPanel: ${await db.delete("forum.panelId")}`,
						});

					if (panelDelete.deletable) await panelDelete.delete();

					const status = await db.delete("forum");

					await message.reply({
						content: `Success: ${status}`,
					});
					return;
				} catch (error) {
					const status = await db.delete("forum");
					await message.reply({
						content: `Success: ${status}\n\`\`\`${error.message}\`\`\``,
					});
				}
		}
	},
};
