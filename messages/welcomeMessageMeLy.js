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

		const getRoleChannel = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("nhận-role")
		);

		const generalChat = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("general-chat")
		);

		const melyChat = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("mely-chat")
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
			content += ` ${member.user}!`;
		}

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(
				`Chào mừng ${member.user.username} đến với ${guild.name}! Hãy bắt đầu làm người một nhà với MeLy với cẩm nang 4 bước nhé!`
			)
			// .setURL(`https://www.facebook.com/code.mely/`)
			.setThumbnail(member.displayAvatarURL({ dynamic: true }))
			.setImage(
				`https://cdn.discordapp.com/attachments/975455262896951317/980289916225323008/Thiet_ke_chua_co_ten_1.jpg`
			)
			.setDescription(
				`1️⃣ Hãy đọc ${rulesChannel} để nắm rõ luật server và nhận vai trò của mình trong ${getRoleChannel} để chọn những tính năng thú vị trong server.\n2️⃣ Chat "say hi" với MeLy trong ${melyChat} để MeLy được làm quen nè!\n3️⃣ Mọi sự kiện quan trọng sẽ được MeLy cập nhật trên fanpage **[Code MeLy](https://www.facebook.com/code.mely)**. Nhớ Like, follow để theo dõi những điều mới mẻ từ server nha!\n4️⃣ Nếu có điều gì thắc mắc, hãy hỏi mọi người tại ${generalChat}. Ở đây không có gì ngoài thân thiện 😁\n\nNote: Bạn có thể gõ ***,mely*** tại mọi nơi để biết thêm về máy chủ!`
			);

		return welcomeChannel.send({
			content: content,
			embeds: [Embed],
		});
	},
};
