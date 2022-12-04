const Discord = require("discord.js");

module.exports = {
	name: "module",
	aliases: ["md"],
	description: "enable/disable module",
	args: true,
	ownerOnly: true,
	options: [
		"all",
		"thankPoint",
		"greeting",
		"dmStudyVoice",
		"forum",
		"emore",
		"detectLang",
		"threadReply",
        "nickname"
	],
	usage: "<on|off>",

	async execute(message, args) {
		const { client, channel, guild } = message;

		const moduleName = args.shift();
		const option = args.shift();
		const db = client.db.table("module");

		if (moduleName === "all") {
			const moduleArray = await db.all();
			const embedDes = moduleArray.map((m) => {
				return `**${m.id}**: \`${m.value ? "on" : "off"}\``;
			});
			const Embed = new Discord.EmbedBuilder()
				.setTitle("Modules")
				.setDescription(embedDes.join("\n"));
			return message.reply({
				embeds: [Embed],
			});
		} else {
			if (!option)
				return message.reply({
					content: `**${moduleName}** is \`${
						(await db.get(moduleName)) ? "enabled" : "disabled"
					}\``,
				});

			if (option !== "on" && option !== "off")
				return message.reply({
					content: `Wrong toggle. Use only \`on\` or \`off\``,
				});

			if (
				moduleName === "thankPoint" &&
				option === "on" &&
				!(await db.get("forum"))
			)
				return message.reply({
					content: `**forum** module must be \`enabled\`\n**${moduleName}** is \`${
						(await db.get(moduleName)) ? "enabled" : "disabled"
					}\``,
				});

			const value = option === "on" ? true : false;
			await db.set(moduleName, value);

			if (
				moduleName === "forum" &&
				option === "off" &&
				(await db.get("thankPoint"))
			) {
				await db.set("thankPoint", false);
			}

			return message.reply({
				content: `**${moduleName}** is \`${
					(await db.get(moduleName)) ? "enabled" : "disabled"
				}\``,
			});
		}
	},
};
