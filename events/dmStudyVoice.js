const { prefix, owner, test_guild_id } = require("../config.json");
const studyTimestamp = new Map();
const { MessageEmbed } = require("discord.js");
const Duration = require("duration");

module.exports = {
	name: "voiceStateUpdate",
	async execute(oldState, newState, client) {
		const moduleTable = client.db.table("module");
		if (!(await moduleTable.get("dmStudyVoice"))) return;

		// ids are not the same
		if (oldState.id !== newState.id) return;

		// user cannot switch between guild
		if (oldState.guild.id !== newState.guild.id) return;

		// exclude all different guilds
		if (
			oldState.guild.id === newState.guild.id &&
			(oldState.guild.id !== test_guild_id ||
				newState.guild.id !== test_guild_id)
		)
			return;

		// all good
		const channels =
			(await oldState.guild.channels.fetch()) ||
			(await newState.guild.channels.fetch());

		const hoiDap = channels.find((c) =>
			c.name.toLowerCase().includes(`hỏi-đáp`)
		);

		const studyCategoryIds = channels
			.filter(
				(c) =>
					c.type == "GUILD_CATEGORY" && c.name.toLowerCase().includes("học")
			)
			.map((c) => c.id);

		const studyVoiceChannelIds = channels
			.filter((c) => c.isVoice() && studyCategoryIds.includes(c.parentId))
			.map((c) => c.id);

		// chuyen voice hoc tap
		if (
			studyVoiceChannelIds.includes(oldState.channelId) &&
			studyVoiceChannelIds.includes(newState.channelId) &&
			oldState.channelId !== newState.channelId
		) {
			console.log(
				`${newState.id} move from voice ${oldState.channelId} to ${newState.channelId}`
			);
			return;
		}

		// tham gia kenh hoc tap
		if (
			!oldState.channelId &&
			studyVoiceChannelIds.includes(newState.channelId)
		) {
			console.log(`${newState.id} join voice ${newState.channelId}`);
			// const textVoiceGif = "https://cdn.discordapp.com/attachments/977409725849272380/983607518301409280/img.gif"
			// const Embed = new MessageEmbed()
			// 	.setColor("RANDOM")
			// 	.setDescription(
			// 		`Xin chào cậu. Hiện MeLy ra thêm 1 danh mục: Học cùng MeLy và thí điểm với việc học lập trình C,C++,python. (Sẽ mở rộng nếu được nhiều cậu ủng hộ).\n\n- Hàng ngày, các cậu tham gia vào phòng voice học cùng MeLy nhé. Nếu có vấn đề, mọi người có thể chat (khung chat nằm bên cạnh phòng) hoặc tạo chủ đề hỏi đáp tại phòng ${hoiDap}\n\n- Vào những khung giờ 20:00 - 22:00 giờ hàng ngày, QTV sẽ để ý các phòng chat hơn và có thể sẽ hỗ trợ, chia sẻ cùng cậu những kiến thức, kinh nghiệm tại các phòng học này. MeLy khuyến khích các bạn mới nên tham gia các phòng tại khung giờ này!\n\n- Nếu cậu có thể tạo một buổi chia sẻ hay thảo luận nhỏ (được phép mở voice, share màn hình), có thể liên hệ trực tiếp đến MeLy nhé! 🥰`
			// 	);
			studyTimestamp.set(newState.id, Date.now());
			// newState.member
			// 	.send({
			// 		embeds: [Embed],
			// 		files: [textVoiceGif]
			// 	})
			// 	.catch((e) => console.log(e));
		}

		// roi khoi kenh hoc tap
		if (
			!newState.channelId &&
			studyVoiceChannelIds.includes(oldState.channelId)
		) {
			console.log(`${oldState.id} left voice ${oldState.channelId}`);
			if (studyTimestamp.has(oldState.id)) {
				const duration = new Duration(
					new Date(studyTimestamp.get(oldState.id)),
					new Date()
				);

				oldState.member
					.send({
						content: `Bạn đã học được \`${duration.toString(1,1)}\`!`,
					})
					.catch((e) => console.log(e));
				studyTimestamp.delete(oldState.id);
			}
		}
	},
};
