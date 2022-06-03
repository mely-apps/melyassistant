const Discord = require("discord.js");
const translate = require("translate-google");

module.exports = {
	async execute(member) {
		const { guild } = member;

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

		const welcomeChannel = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("say-hi")
		);

		const guideChannel = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("hướng-dẫn")
		);

		const generalChat = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("general-chat")
		);

		const hoidapChannel = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("hỏi-đáp")
		);

		const langs = Object.keys(require("../constants/locale"));
		langs.shift();

		let lang = langs[Math.floor(Math.random() * langs.length)];

		let content = "**Hello**";

		try {
			content = await translate(content, { from: "en", to: lang });
		} catch (error) {
			console.log(error);
			content = "**Hello**";
		} finally {
			content += ` ${member.user}**!**`;
		}

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(`Chào mừng ${member.user.username} đến với ${guild.name}!`)
			.setURL(`https://www.facebook.com/code.mely/`)
			.setThumbnail(member.displayAvatarURL({ dynamic: true }))
			.setImage(
				`https://cdn.discordapp.com/attachments/975455262896951317/980289916225323008/Thiet_ke_chua_co_ten_1.jpg`
			)
			.setDescription(
				`> Những thông báo quan trọng sẽ được đăng tải trên fanpage **[Code MeLy](https://www.facebook.com/code.mely/)**, nhớ theo dõi nhé!`
			)
			.addField(
				"**NỘI QUY**",
				`> Bạn hãy đọc nội quy tại <#${guild.rulesChannelId}> nhé!\n> Một điều nữa là Code MeLy tuân thủ theo **[Điều khoản dịch vụ](https://discord.com/terms)** và **[Nguyên tắc cộng đồng](https://discord.com/guidelines)** của **[Discord](https://discord.com)**!`
			)
			.addField(
				"**HƯỚNG DẪN**",
				`> Chúng tớ hay chat chít ở <#${generalChat.id}> nè.\n> Nếu bạn có thắc mắc về lập trình cần được giải đáp, bạn có thể tạo 1 chủ đề tại <#${hoidapChannel.id}> nha!\n> Hãy ghé qua <#${guideChannel.id}> để biết thêm về máy chủ Code MeLy nhé!`
			)
			.setFooter({
				text: "Nếu bạn cần giúp đỡ, hãy liên hệ với các mod đang online để được trợ giúp nhanh nhất!",
			});

		return welcomeChannel.send({
			content: content,
			embeds: [Embed],
		});
	},
};
