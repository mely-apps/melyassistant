const { prefix, owner, test_guild_id } = require("../config.json");

module.exports = {
	name: "voiceStateUpdate",
	async execute(oldState, newState, client) {
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
		if (studyVoiceChannelIds.includes(newState.channelId)) {
			console.log(`${newState.id} join voice ${newState.channelId}`);
            newState.member.send({
                content: `Cảm ơn bạn đã tham gia học với MeLy! 😁`
            }).catch((e) => console.log(e))
		}

		// roi khoi kenh hoc tap
		if (studyVoiceChannelIds.includes(oldState.channelId)) {
			console.log(`${oldState.id} left voice ${oldState.channelId}`);
            oldState.member.send({
                content: `Cảm ơn bạn đã dành thời gian học với MeLy! 😭`
            }).catch((e) => console.log(e))
		}
	},
};
