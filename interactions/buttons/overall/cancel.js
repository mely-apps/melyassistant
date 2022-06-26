module.exports = {
	id: "cancel",
	filter: "author",

	async execute(interaction) {
		const { client } = interaction;
		// console.log(interaction.message)
		await interaction.update({
			// content: "This was a reply from button handler!",
			components: client.disableComponent(interaction.message),
		});
		// return;
	},
};