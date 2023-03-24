const Discord = require("discord.js");

module.exports = async (guild) => {
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

	return new Discord.EmbedBuilder()
		.setColor("Random")
		.setDescription(
			`🚦 Nhận vai trò tại ${getRoleChannel}; Theo dõi nội quy tại ${rulesChannel}\n\n💬 Giao lưu trò chuyện với mọi người ở ${generalChat} nhé!\n\n❓ Cậu có thể hỏi bài tập hoặc hỗ trợ bài tập mọi người tại ${hoiDap}\n\n📄 Tìm và chia sẻ các tài liệu đủ mọi chủ đề ở kênh ${taiLieu}\n\n🎸 Tìm, tạo các hội nhóm nhỏ về game, âm nhạc,... tại ${club}\n\n🧑‍🏫 Tham gia trao đổi về các kì thi lập trình thi đấu sau khi kết thúc ${contest}\n\n🌠 Theo dõi các sự kiện sắp tới của MeLy và nhận thông báo tại ${notification}\n\n🆘 Nếu cậu có thắc mắc, khó khăn. Hãy chia sẻ với các Mod tại ${generalChat} , mọi người sẽ sẵn sàng hỗ trợ cậu. Nếu vấn đề riêng tư, cậu có thể inbox hoặc liên hệ trực tiếp đến fanpage **[Code MeLy](https://www.facebook.com/code.mely)**. Hy vọng cẩm nang này sẽ có ích đến cậu! 😘`
		);
};
