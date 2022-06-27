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
			"nickname",
		];

		(async () => {
			for (let moduleName of modules) {
				if (!(await moduleTable.has(moduleName))) {
					console.log(`New module ${moduleName}`);
					await moduleTable.set(moduleName, false);
				}
			}

			const modulesDb = (await moduleTable.all()).map((e) => e.id);

			for (let moduleName of modulesDb) {
				if (!modules.includes(moduleName)) {
					console.log(`Expired module ${moduleName}`);
					await moduleTable.delete(moduleName);
				}
			}
		})();
	},
};
