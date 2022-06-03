 module.exports = {
	name: "voiceStateUpdate",
	async execute(oldState, newState) {
		// console.log(oldState, newState)

        if (oldState.id !== newState.id) return;

        // join voice
        if (oldState.channelId === null && newState.channelId !== null) console.log(`${newState.id} join voice ${newState.channelId}`)

        // leave voice
        if (oldState.channelId !== null && newState.channelId === null) console.log(`${oldState.id} left voice ${oldState.channelId}`)

        // move voice
        if (oldState.channelId !== null && newState.channelId !== null && oldState.channelId !== newState.channelId) console.log(`${oldState.id} moved from voice ${oldState.channelId} to ${newState.channelId}`)
	},
};
