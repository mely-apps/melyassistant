const Discord = require("discord.js");

module.exports = {
	name: "serverinfo",
	description: "Display guild's info",
	category: "information",
	aliases: ["guildinfo"],
	usage: "",
	cooldown: 5,
	args: false,
	ownerOnly: false,
	// maintain: true,
	permissions: ["SEND_MESSAGES"],

	async execute(message, args, guildSettings, Player) {
		const { client, guild } = message;

		// const msg = await message.reply({
		// 	content: "Loading... (It may take upto several minutes due to the big guild size)",
		// });

		// console.log(guild);
		const owner = await guild.members.fetch(guild.ownerId);

		// console.log("running");
		const guildChannels = await guild.channels.fetch();
		// console.log(guildChannels);

		const guildRoles = await guild.roles.fetch();
		// console.log(guildRoles);

		const guildMembers = await guild.members.fetch();
		// console.log(guildMembers);

		// return;
		const channels = {
			voice: guildChannels.filter((c) => c.isVoice()).size,
			text: guildChannels.filter((c) => c.isText()).size,
		};

		const members = {
			user: guildMembers.filter((m) => m.user.bot !== true).size,
			bot: guildMembers.filter((m) => m.user.bot === true).size,
		};

		const features = await guild.features.map((f) =>
			capitalizeFirstLetter(f.toLowerCase().replace(/_+/g, " "))
		);

		const Embed = new Discord.MessageEmbed()
			.setTitle(guild.name + "'s Informations")
			.setColor("RANDOM")
			// .setDescription(timeConverter(guild.joinedTimestamp))
			.setThumbnail(guild.iconURL({ size: 1024, dynamic: true }))
			.addField("Owner", `\`\`\`${owner.user.tag}\`\`\``, true)
			// .addField("Prefix", `\`\`\`${guildSettings.prefix}\`\`\``, true)
			.addField("Roles", "```" + guildRoles.size + " roles```", true)
			.addField(
				channels.voice + channels.text + " Channels",
				`\`\`\`Texts: ${channels.text}\nVoices: ${channels.voice}\`\`\``,
				true
			)
			.addField(
				guild.memberCount + " Members",
				`\`\`\`Users: ${members.user}\nBots: ${members.bot}\`\`\``,
				true
			)
			.addField(
				"Additional",
				`\`\`\`Created at: ${timeConverter(
					guild.joinedTimestamp
				)}\nVerification Level: ${guild.verificationLevel}\nBoost Level: ${
					guild.premiumTier
				}\nBoost Count: ${guild.premiumSubscriptionCount}\nPreferred Locale: ${
					guild.preferredLocale
				}\`\`\``
			)
			.addField("Features", "```" + features.join(", ") + "```")
			.setFooter({ text: `ID: ${guild.id}` })
			.setTimestamp(guild.joinedTimestamp);

		return message.reply({
			embeds: [Embed],
		});
	},
};

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function timeConverter(UNIX_timestamp) {
	var a = new Date(UNIX_timestamp);
	var months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time =
		month + " " + date + " " + year + " " + hour + ":" + min + ":" + sec;
	return time;
}
