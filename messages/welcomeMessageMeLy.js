const Discord = require("discord.js");
const translate = require("translate-google");
const { owner } = require("../config.json");

module.exports = {
	async execute(member) {
		const { client, guild } = member;

		const fetchedGuild = await guild.fetch();

		if (member.user.bot) {
			const botRole =
				(await guild.roles.cache.find((r) => r.name.toLowerCase() == "bots")) ||
				(await guild.roles.create({
					name: "bots",
					reason: "role to add all bots in",
				}));

			try {
				await member.roles.add(botRole);
			} catch (error) {
				console.log(error);
			}
			return;
		}

		if (client.string.validateZalgo(member.user.username)) {
			let newName = client.removeZalgo(member.user.username);
			try {
				await member.setNickname(newName, "Tên không hợp lệ");
				await member.send({
					embeds: [
						new Discord.EmbedBuilder()
							.setColor("Red")
							.setDescription(
								`Vì username của cậu sẽ có thể gây rối trong công tác quản trị máy chủ **Code MeLy**. Nickname mới của cậu sẽ được đặt thành \`${newName}\`. Cậu có thể chọn thay đổi nickname mới hoặc giữ nguyên như vậy.\nNếu tên hiển thị của bạn vẫn còn không hợp lệ (chứa các ký tự khó để nhìn, không thể gõ như bình thường), MeLy phải buộc lòng mời cậu ra khỏi máy chủ.`
							),
					],
				});
			} catch (error) {
				let fiezt = await client.users.fetch(owner);
				await fiezt.send({
					content: `${member.id}\nĐổi nickname: ${newName}\n\`\`\`${error.message}\`\`\``,
				});
				console.log(error);
			}
		}

		const welcomeChannel = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("say-hi")
		);

		const generalChat = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("general-chat")
		);

		const rulesChannel = await guild.rulesChannel;

		const langs = Object.keys(require("../constants/locale"));
		langs.shift();

		let lang = langs[Math.floor(Math.random() * langs.length)];

		let content = "Hello";

		try {
			content = await translate(content, { from: "en", to: lang });
		} catch (error) {
			console.log(error);
			content = "Hello";
		} finally {
			content += ` ${member}!`;
		}

		const row = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
				.setStyle(Discord.ButtonStyle.Link)
				.setURL(`${rulesChannel.url}`)
				.setLabel("Đọc luật đã nào!"),
			new Discord.ButtonBuilder()
				.setStyle(Discord.ButtonStyle.Link)
				.setURL(`${generalChat.url}`)
				.setLabel("Cùng tám thôi!")
		);

		const Embed = new Discord.EmbedBuilder()
			.setColor("Random")
			.setAuthor()
			.setTitle(
				`Chào mừng ${client.displayName(member)} đã đến với vũ trụ ${
					guild.name
				}!`
			)
			.setThumbnail(member.displayAvatarURL({ dynamic: true }))
			.setImage(`${guild.bannerURL({ dynamic: true })}}`);

		return welcomeChannel.send({
			content: content,
			embeds: [Embed],
            components: [row]
		});
	},
};
