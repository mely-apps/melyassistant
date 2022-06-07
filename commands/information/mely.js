const Discord = require("discord.js");

module.exports = {
	name: "mely",
	aliases: ["guide", "hd", "huongdan"],
	description: "get mely guide",

	async execute(message, args) {
		const { guild } = message;

		const rulesChannel = await guild.rulesChannel;

		const getRoleChannel = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("nhận-role")
		);

		const generalChat = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("general-chat")
		);

		const melyChat = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("mely-chat")
		);

		const hoiDap = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("hỏi-đáp")
		);

		const taiLieu = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("tài-liệu")
		);

		const club = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("club")
		);

		const contest = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("contest")
		);

		const notification = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("notification")
		);

		const Embed = new Discord.MessageEmbed().setColor("RANDOM")
			.setDescription(`🚦 Nhận vai trò tại ${getRoleChannel}; Theo dõi nội quy tại ${rulesChannel}\n\n💬 Giao lưu trò chuyện với mọi người ở ${generalChat}  hoặc ${melyChat}  nhé!\n\n❓ Cậu có thể hỏi bài tập hoặc hỗ trợ bài tập mọi người tại ${hoiDap}\n\n📄 Tìm và chia sẻ các tài liệu đủ mọi chủ đề ở kênh ${taiLieu}\n\n🎸 Tìm, tạo các hội nhóm nhỏ về game, âm nhạc,... tại ${club}\n\n🧑‍🏫 Tham gia trao đổi về các kì thi lập trình thi đấu sau khi kết thúc ${contest}\n\n🌠 Theo dõi các sự kiện sắp tới của MeLy và nhận thông báo tại ${notification}\n\n💟 Vào 20:00 - 22:00 mỗi tối, cậu có thể tham gia học tập tại các phòng voice học tập. Bà già MeLy sẽ phát quà tại các phòng và Helper sẽ hỗ trợ cậu nếu có vấn đề khó khăn. 😊\n\n🆘 Nếu cậu có thắc mắc, khó khăn. Hãy chia sẻ với các Mod tại ${generalChat} , mọi người sẽ sẵn sàng hỗ trợ cậu. Nếu vấn đề riêng tư, cậu có thể inbox hoặc liên hệ trực tiếp đến fanpage Code MeLy. Hy vọng cẩm nang này sẽ có ích đến cậu! 😘`);

		try {
			await message
				.reply({
					embeds: [Embed],
				})
				.then(async (msg) => {
					setTimeout(async () => {
						if (msg && msg.deletable) await msg.delete();
						if (message && message.deletable) await message.delete();
					}, 60000);
				});
		} catch (error) {
			console.log(error.message);
		}
	},
};
