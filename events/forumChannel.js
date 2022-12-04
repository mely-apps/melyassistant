const { prefix, owner, test_guild_id } = require("../config.json");
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Events, ButtonStyle } = require("discord.js");

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const { client, guild, channel, content, author } = message;
		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("forum"))) return;
		if (!guild || guild == null) return;

		if (guild.id != test_guild_id) return;
		const db = client.db.table("settings");

		if (!(await db.has("forum")) || !(await db.has("forum.id"))) return;

		if (channel.id != (await db.get("forum.id"))) return;

		if (author.id == client.user.id && message.type === "REPLY") return;

		// if (author.id == client.user.id) return;

		// const lastMessage = await channel.messages.fetch({ limit: 1 });

		// if (lastMessage.author.id == client.user.id) return;

		if (message.embeds.length > 0) return;

		if (content.startsWith(prefix.toLowerCase())) return;

		// console.log(message);

		const Embed = new EmbedBuilder()
			.setColor("Random")
			.setTitle("HỎI ĐÁP")
			.setDescription("Bấm nút dưới và đặt câu hỏi");

		const row = [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId("forum")
					.setDisabled(false)
					.setStyle(ButtonStyle.Success)
					.setLabel("ĐẶT CÂU HỎI")
					.setEmoji("❔")
			),
		];

		const msg = await channel.send({
			embeds: [Embed],
			components: row,
		});

		if ((await db.get("forum.panelId")) != null) {
			const oldPanelId = await db.get("forum.panelId");

			const oldPanel = await channel.messages.fetch(oldPanelId);

			if (oldPanel.deletable) await oldPanel.delete();
		}

		await db.set("forum.panelId", msg.id);

		// console.log(lastMessage);
	},
};
