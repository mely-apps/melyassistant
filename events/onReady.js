const numeral = require("numeral");

module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		const AnHour = 3_600_000;

		console.log(`Ready! Logged in as ${client.user.tag}`);
		let uCount = () => numeral(client.users.cache.size).format("0.0a");
		client.user.setPresence({
			status: "online",
			afk: false,
			activities: [
				{
					name: `Code MeLy | ${uCount()} users`,
					type: 3,
				},
			],
		});
		setInterval(async () => {
			client.user.setPresence({
				status: "online",
				afk: false,
				activities: [
					{
						name: `Code MeLy | ${uCount()} users`,
						type: 3,
					},
				],
			});
		}, AnHour);

		// setup module db
		const moduleTable = client.db.table("module");
		const modules = [
			"thankPoint",
			"greeting",
			"dmStudyVoice",
			"forum",
			"emore",
			"detectLang",
			"threadReply",
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
