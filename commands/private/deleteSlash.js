const { token, client_id, test_guild_id } = require("../../config");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const rest = new REST({ version: "10" }).setToken(token);

module.exports = {
	name: "deleteslash",
	description: "delete slash command",
	category: "private",
	// args: true,
	ownerOnly: true,

	async execute(message, args) {
		const { client } = message;
		
		await rest
			.get(Routes.applicationGuildCommands(client_id, test_guild_id))
			.then((data) => {
				const promises = [];
				for (const command of data) {
					const deleteUrl = `${Routes.applicationGuildCommands(
						client_id,
						test_guild_id
					)}/${command.id}`;
					promises.push(rest.delete(deleteUrl));
				}
				return Promise.all(promises);
			});

		return message.reply("Done");

		//Routes.applicationCommands(client_id)
	},
};
