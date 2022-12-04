const { ChannelType } = require("discord.js");

const isNormalTextChannel = (channel) =>
	!(
		!channel.type === ChannelType.GuildText ||
		channel.type === ChannelType.AnnouncementThread ||
		channel.type === ChannelType.PrivateThread ||
		channel.type === ChannelType.PublicThread
	);

module.exports = { isNormalTextChannel };
