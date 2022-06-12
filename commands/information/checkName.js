const Discord = require("discord.js");
const { MessageButtonPages } = require("discord-button-page");

module.exports = {
	name: "checkname",
	description: "show list of unsuitable display names",
	// args: true,
	permissions: ["ADMINISTRATOR"],
	// ownerOnly: true,

	async execute(message, args) {
		const { client, guild, member, channel } = message;

		const members = await guild.members.fetch();
		const unsuitableMembers = members
			.map((m) => {
				if (
					!lettersNumbersSpacesDashes(removeAccents(client.displayName(m))) &&
					!m.user.bot
				)
					return `ID: ${m.id} | ${client.displayName(m)}#${
						m.user.discriminator
					}`;
			})
			.filter((m) => m !== undefined);

		const tempArray = [];

		while (unsuitableMembers.length) {
			tempArray.push(unsuitableMembers.splice(0, 20));
		}

		const pages = tempArray.map((c) =>
			new Discord.MessageEmbed().setDescription(`\`\`\`${c.join("\n")}\`\`\``)
		);

		if (pages.length < 2)
			return message.reply({
				content: `\`\`\`${unsuitableMembers.join("\n")}\`\`\``,
			});

		const embedPages = new MessageButtonPages()
			.setDuration(60000)
			.setEmbeds(pages)
			.setReply(true);

		embedPages.build(message);
	},
};

function splitter(str, l) {
	var strs = [];
	while (str.length > l) {
		var pos = str.substring(0, l).lastIndexOf(" ");
		pos = pos <= 0 ? l : pos;
		strs.push(str.substring(0, pos));
		var i = str.indexOf(" ", pos) + 1;
		if (i < pos || i > pos + l) i = pos;
		str = str.substring(i);
	}
	strs.push(str);
	return strs;
}

function lettersNumbersSpacesDashes(str) {
	return /^[A-Za-z0-9 -_]*$/.test(str);
}

function removeAccents(str) {
	return String(str)
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "D");
}
