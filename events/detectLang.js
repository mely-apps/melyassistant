const { prefix, owner, test_guild_id } = require("../config.json");
const detectLang = require("lang-detector");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	name: "messageCreate",

	async execute(message) {
		const { client, guild, channel, content, author, member } = message;

		if (author.bot) return;

		// if (author.id !== "445102575314927617") return;

		if (!guild || guild == null) return;

		if (guild.id != test_guild_id) return;

		if (!message.content) return;

		if (message.mentions.users.size > 0 || message.mentions.members.size > 0)
			return;

		const res = await detectLang(message.content, {
			statistics: true,
		});

		if (res.detected == "Unknown") return;

		if (message.content.includes("```")) return;

		console.log(res);

		// if (message.content.length > 1000) return;

		const lang = res.detected.toLowerCase();

		if (res.statistics[res.detected] < 5) return;

		const codeBlockNonFormat = "\\`\\`\\`";
		const codeBlockFormat = "```";

		let contentCodeBlock = `${codeBlockFormat}${lang}\n${content}\n${codeBlockFormat}`;

		let object = {
			content: contentCodeBlock,
			username: `${displayName(member)}`,
			avatarURL: member.displayAvatarURL({ dynamic: true }),
		};

		try {
			const webhooks = await channel.fetchWebhooks();

			if (!webhooks.size) {
				await channel
					.createWebhook(client.user.username + " detectLang")
					.then(async (webhook) => {
						await webhook
							.send(object)
							.catch(console.error);
					})
					.catch(console.error);
			} else {
				const webhook = await webhooks.first();
				await webhook.send(object).catch(console.error);
			}

			if (message.deletable) await message.delete();
		} catch (error) {
			console.log(error);
		}

		// const row = [
		// 	new MessageActionRow().addComponents(
		// 		new MessageButton()
		// 			.setCustomId("save")
		// 			.setLabel("Lưu")
		// 			.setStyle("SECONDARY")
		// 			.setEmoji("💾")
		// 	),
		// ];

		// console.log(res);
		// try {
		// 	await message
		// 		.reply({
		// 			content: `Hãy thêm dấu ${codeBlockNonFormat} vào đầu và cuối code của bạn để nó dễ nhìn hơn!\n__**Ví dụ:**__\n${codeBlockNonFormat}${lang}\n${example(
		// 				lang
		// 			)}\n${codeBlockNonFormat}\n__**Nó sẽ thành như này:**__\n${codeBlockFormat}${lang}\n${example(
		// 				lang
		// 			)}\n${codeBlockFormat}`,
		// 			components: row,
		// 		})
		// 		.then(async (msg) => {
		// 			setTimeout(async () => {
		// 				if (msg && msg.deletable) await msg.delete();
		// 			}, 30000);
		// 		});
		// } catch (error) {
		// 	console.log(error.message);
		// }
	},
};

function example(lang) {
	switch (lang) {
		case "javascript":
			return `console.log("Hello World")`;
		case "c":
			return `#include <stdio.h>\nint main() {\n\tprintf("Hello World");\n\treturn 0;\n}`;
		case "c++":
			return `#include <iostream>\nint main() {\n\tstd::cout << "Hello World";\n\treturn 0;\n}`;
		case "python":
			return `print('Hello World')`;
		case "java":
			return `public class HelloWorld {\n\tpublic static void main(String []args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}`;
		case "html":
			return `<!DOCTYPE html>\n<html>\n<title>Hello World</title>\n<body>\nHello World\n<h1>This is header 1</h1>\n<p>This is a pharagraph</p>\n</body>\n</html>`;
		case "css":
			return `body {\n\tbackground-color: blue;\n}\nh1 {\n\tbackground–color: purple;\n}`;
		case "ruby":
			return `puts "Hello World"`;
		case "go":
			return `package main\nimport "fmt"\nfunc main() {\n\tfmt.Println("Hello World")\n}`;
		case "php":
			return `<?php\necho 'Hello World';\n?>`;
	}
}

function displayName(member) {
	return member.nickname ? member.nickname : member.user.username;
}
