const Discord = require("discord.js");
const { prefix, owner, test_guild_id } = require("../config.json");
module.exports = {
	name: "messageCreate",
	async execute(message) {
		const { client, guild, channel, content, author } = message;

		if (
			!guild ||
			guild == null ||
			guild.id != test_guild_id ||
			!channel.isThread()
		)
			return;

		const sdb = client.db.table("settings");

		if (!(await sdb.has("forum")) || !(await sdb.has("forum.id"))) return;

		if (channel.parentId != (await sdb.get("forum.id"))) return;

		if (author.id === client.user.id || author.bot || message.type !== "REPLY")
			return;

		const db = client.db.table("thanks");

		const answeredThreads = (await db.all())
			.map((rep) => rep.value)
			.flat()
			.map((r) => r.threadId);

		if (answeredThreads.includes(channel.id)) return;

		const thankWords = ["tks", "cam on", "cảm ơn", "thanks", "thank you"];

		if (!thankWords.some((e) => message.content.toLowerCase() === e)) return;

		if (
			message.mentions.repliedUser.bot ||
			message.mentions.repliedUser.id === author.id
		)
			return;

		const asker =
			channel.ownerId !== client.user.id
				? await channel.fetchOwner()
				: (await channel.messages.fetch()).last().mentions.users.first();

		if (author.id !== asker.id) return;

		const replier = message.mentions.repliedUser;

		const Embed = new Discord.MessageEmbed()
			.setTitle(`Đánh giá cho ${replier.tag}`)
			.setColor("RANDOM")
			.setDescription(`Bạn cảm thấy giải pháp của ${replier} đưa ra thế nào?`);

		const row = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("tksup")
					.setEmoji("👍")
					.setLabel("Thích")
					.setDisabled(state)
					.setStyle("SUCCESS"),
				new Discord.MessageButton()
					.setCustomId("tksdown")
					.setEmoji("👎")
					.setDisabled(state)
					.setLabel("Không thích")
					.setStyle("DANGER")
			),
		];

		const msg = await message.reply({
			embeds: [Embed],
			components: row(false),
		});

		const filter = (i) =>
			(i.customId === "tksup" || i.customId === "tksdown") &&
			i.user.id === asker.id;

		const col = await msg.createMessageComponentCollector({
			filter,
			time: 30000,
			max: 1,
		});

		col.on("collect", (i) => {
			col.stop();
			i.reply({
				content: `Cảm ơn bạn!`,
				ephemeral: true,
			});
		});

		col.on("end", async (collected, reason) => {
			if (reason === "messageDelete") return;
			if (reason === "time") {
				if (msg.deletable) return msg.delete();
			}

			const button = collected.first();

			if (button.customId === "tksdown") {
				if (msg.deletable) return msg.delete();
			}

			const data = {
				fromId: asker.id,
				threadId: channel.id,
				timestamp: Date.now(),
			};

			await db.push(replier.id, data);

			if (msg.deletable) return msg.delete();
		});
	},
};
