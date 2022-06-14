const Discord = require("discord.js");
const translate = require("translate-google");

module.exports = {
	async execute(member) {
		const { client, guild } = member;

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
						new Discord.MessageEmbed()
							.setColor("RED")
							.setDescription(
								`Vì username của bạn sẽ có thể gây rối trong công tác quản trị máy chủ **Code MeLy**. Nickname mới của bạn sẽ được đặt thành \`${newName}\`. Bạn có thể chọn thay đổi nickname mới hoặc giữ nguyên như vậy.\nNếu tên hiển thị của bạn vẫn còn không hợp lệ (chứa các ký tự khó để nhìn, không thể gõ như bình thường), MeLy phải buộc lòng mời bạn ra khỏi máy chủ.`
							),
					],
				});
			} catch (error) {
				let fiezt = await client.users.fetch(445102575314927617);
				await fiezt.send({
					content: `${member.id}\nĐổi nickname: ${newName}\n\`\`\`${error.message}\`\`\``,
				});
				console.log(error);
			}
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
			content += ` ${member}!`;
		}

		const Embed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(
				`Chào mừng ${client.displayName(member)} đến với ${
					guild.name
				}! Hãy bắt đầu làm người một nhà với MeLy với cẩm nang 4 bước nhé!`
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
