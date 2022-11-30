const Discord = require("discord.js");
const { test_guild_id } = require("../config.json");
module.exports = {
	name: Discord.Events.ThreadUpdate,
	async execute(oldThread, newThread, client) {
		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("thankPoint"))) return;

		if (
			oldThread.guildId !== test_guild_id ||
			newThread.guildId !== test_guild_id
		)
			return;

		if (oldThread.name !== newThread.name) return;

		if (!newThread.archived) return;

		if (
			oldThread.type !== "GUILD_PUBLIC_THREAD" ||
			newThread.type !== "GUILD_PUBLIC_THREAD"
		)
			return;

		const sdb = client.db.table("settings");

		if (!(await sdb.has("forum")) || !(await sdb.has("forum.id"))) return;

		if (
			oldThread.parentId !== (await sdb.get("forum.id")) ||
			newThread.parentId !== (await sdb.get("forum.id"))
		)
			return;

		const db = client.db.table("thanks");

		const answeredThreads = (await db.all())
			.map((rep) => rep.value)
			.flat()
			.map((r) => r.threadId);

		if (
			answeredThreads.includes(oldThread.id) ||
			answeredThreads.includes(newThread.id)
		)
			return;

		const asker =
			oldThread.ownerId !== client.user.id
				? (await oldThread.fetchOwner()).user
				: (await oldThread.messages.fetch()).last().mentions.users.first();

		const threadMsgs = await newThread.messages.fetch();

		const options = threadMsgs
			.map((m) => m.member)
			.filter((m) => !m.user.bot && m.user.id !== asker.id)
			.filter((v, i, s) => s.indexOf(v) == i)
			.map((tm) => {
				return {
					label: `${client.displayName(tm)} (${
						threadMsgs.filter((m) => m.author.id === tm.id).size
					} tin nhắn)`,
					description: `${tm.user.tag}`,
					value: `${tm.id}`,
				};
			});

		if (!options.length) return;

		const embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(newThread.name)
			.setDescription(
				`Ai vừa giúp bạn giải quyết vấn đề ở ${newThread} vậy?\n\n> Hãy chọn 1 người trong menu xổ xuống ở đưới nếu người đó đã giúp bạn giải quyết chủ đề bạn hỏi, nếu không có ai giúp bạn giải quyết hoặc không có tên họ trong danh sách hãy bấm nút **\`KHÔNG\`** màu đỏ.`
			);

		const row = (state) => [
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId("tksselect")
					.setPlaceholder(`Chọn người đã giúp bạn...`)
					.addOptions(options)
					.setDisabled(state)
			),
			new Discord.MessageActionRow().addComponents(
				new Discord.MessageButton()
					.setCustomId("cancel")
					.setDisabled(state)
					.setStyle("DANGER")
					.setLabel("KHÔNG")
			),
		];

		try {
			const msg = await asker.send({
				embeds: [embed],
				components: row(false),
			});
			const watingThankDB = client.db.table("waitingThanks");
			await watingThankDB.set(`${msg.channelId}`, msg.id);
		} catch (error) {
			console.log(error);
		}
	},
};
