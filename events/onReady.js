module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setPresence({
			status: "online",
			afk: false,
			activities: [
				{
					name: `Code MeLy`,
					type: 3,
				},
			],
		});

		
	},
};
