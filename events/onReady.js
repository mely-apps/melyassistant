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

		// setup module db
		const moduleTable = client.db.table("module");
		const modules = [
			"thankPoint",
			"greeting",
			"dmStudyVoice",
			"forum",
			"emore",
			"detectLang",
			"introThread",
		];

		(async () => {
			for (let moduleName of modules) {
				if (!(await moduleTable.has(moduleName))) {
					console.log(`Registering db module ${moduleName}`);
					await moduleTable.set(moduleName, false);
				}
			}
		})();
	},
};
