const Discord = require("discord.js");

module.exports = {
	async execute(member, join = false) {
		const Embed = new Discord.MessageEmbed();

		if (join === false) {
		} else if (join === true) {
		}
	},
};

/**
 * Bạn đang tham gia vào phòng voice trong discord Code MeLy.
- Khi tham gia phòng học yên tĩnh, hãy tắt mic
- Khi tham gia phòng học can speak, bạn có thể nói chuyện
- Khi tham gia phòng Cam & Stream, bạn cần phải mở Cam hoặc Stream. Hệ thống sẽ tự động kick sau 59s nếu bạn không bật Cam hoặc Stream.
- Bạn có thể tạo phòng học nhóm cùng bạn bè trong danh mục phòng nhóm. 
Tham gia các phòng học, bạn có thể lên điểm kinh nghiệm và có thể sử dụng điểm tích lũy để tham gia vào các hoạt động thú vị mà MeLy sẽ ra mắt trong tương lai.
Nếu cậu có điều gì cần MeLy hỗ trợ, đừng quên chia sẻ với MeLy tại: 💬-mely-chat nhé! 
Chụt....
 */