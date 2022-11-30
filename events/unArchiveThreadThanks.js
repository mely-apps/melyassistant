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

		if (newThread.archived) return;

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

		const asker =
			oldThread.ownerId !== client.user.id
				? (await oldThread.fetchOwner()).user
				: (await oldThread.messages.fetch()).last().mentions.users.first();

		const watingThankDB = client.db.table("waitingThanks");
		if (await watingThankDB.has(asker.dmChannel.id)) {
			const waitingMsg = await (
				await client.channels.fetch(asker.dmChannel.id)
			).messages.fetch(await watingThankDB.get(asker.dmChannel.id));
			if (waitingMsg.deletable) {
				waitingMsg.delete();
				await watingThankDB.delete(asker.dmChannel.id)
			}
		}

		const db = client.db.table("thanks");

		const thankArray = await db.all();

		const answeredThreads = thankArray
			.map((rep) => rep.value)
			.flat()
			.map((r) => r.threadId);

		if (
			!answeredThreads.includes(oldThread.id) &&
			!answeredThreads.includes(newThread.id)
		)
			return;

		const exec = (o) => o.threadId === newThread.id && o.fromId === asker.id;

		const replierId = thankArray.find((e) => e.value.find(exec)).id;

		const replier = client.users.cache.has(replierId)
			? client.users.cache.get(replierId)
			: `<@${replierId}>`;

		await db.pull(replierId, exec);
		client.actionlog(
			"-thankPoint",
			`From ${asker.id} to ${replierId}\nReason: unarchive`
		);

		asker
			.send({
				content: `Câu hỏi ${newThread} của bạn vừa được mở lại và đồng thời ${replier} cũng bị trừ điểm!`,
			})
			.catch(console.log);

		// client.emit("log", "unarchiveThreadTks", `At: ${newThread}\nAuthor: ${asker.id}\nVictim: ${replier.id}`);
	},
};
