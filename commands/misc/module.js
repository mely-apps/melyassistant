const Discord = require("discord.js");

module.exports = {
	name: "module",
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
		"introThread",
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
			const Embed = new Discord.MessageEmbed()
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

			const value = option === "on" ? true : false;
			await db.set(moduleName, value);

			return message.reply({
				content: `**${moduleName}** is \`${
					(await db.get(moduleName)) ? "enabled" : "disabled"
				}\``,
			});
		}
	},
};
