const { prefix, owner, test_guild_id } = require("../config.json");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	name: "messageCreate",
	async execute(message) {
		const { client, guild, channel, content, author } = message;

		if (!guild || guild == null) return;

		if (guild.id != test_guild_id) return;

		if (!(await client.db.global.has("forumChannel"))) return;

		if (channel.id != (await client.db.global.get("forumChannel"))) return;

		if (author.id == client.user.id && message.type === "REPLY") return;

		// if (author.id == client.user.id) return;

		// const lastMessage = await channel.messages.fetch({ limit: 1 });

		// if (lastMessage.author.id == client.user.id) return;

		if (message.embeds.length > 0) return;

		if (content.startsWith(prefix.toLowerCase())) return;

		// console.log(message);

		const Embed = new MessageEmbed()
			.setColor("RANDOM")
			.setTitle("HỎI ĐÁP")
			.setDescription("Bấm nút dưới và đặt câu hỏi");

		const row = [
			new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId("forum")
					.setDisabled(false)
					.setStyle("SUCCESS")
					.setLabel("ĐẶT CÂU HỎI")
					.setEmoji("❔")
			),
		];

		const msg = await channel.send({
			embeds: [Embed],
			components: row,
		});

		if ((await client.db.forum.get("panel")) != null) {
			const oldPanelId = await client.db.forum.get("panel");

			const oldPanel = await channel.messages.fetch(oldPanelId);

			if (oldPanel.deletable) await oldPanel.delete();
		}

		await client.db.forum.set("panel", msg.id);

		// console.log(lastMessage);
	},
};
