/**
 *
 * @param {import("discord.js").Guild} guild
 * @returns {import("discord.js").Attachment}
 */
const getRandomWelcomeImage = async (guild) => {
	const imagesChannelCache = await guild.channels.cache.find((c) =>
		c.name.toLowerCase().includes("image-welcome")
	);
	const imagesChannel = await imagesChannelCache.fetch();
	const messages = await imagesChannel.messages.fetch();
	const message = messages.random();
	return message.attachments.first();
};

module.exports = { getRandomWelcomeImage };
