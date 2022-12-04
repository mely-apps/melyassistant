const Discord = require("discord.js");

module.exports = (client) => {
	client.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	client.number = (input) =>
		input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	client.getUserFromMention = (args) => {
		var mention, id, matches;
		args.forEach((element, index) => {
			if (index > 0 && id) return;
			matches = element.match(/^<@!?(\d+)>$/);
			if (!matches) return;
			return (id = matches[1]);
		});
		if (!id) return;
		return client.users.fetch(id);
	};

	client.getChannelId = (args) => {
		var id, matches;
		args.forEach((element, index) => {
			if (index > 0 && id) return;
			matches = element.match(/^<#?(\d+)>$/);
			if (!matches) return;
			return (id = matches[1]);
		});
		return id;
	};

	client.displayName = (member) =>
		member.nickname ? member.nickname : member.user.username;

	client.disableComponent = (message, state = true) => {
		if (!message) return [];

		const { components } = message;

		if (!components || !components.length || components.size <= 0) return null;

		const COMPONENTS = components.map((row) =>
			new Discord.ActionRowBuilder().addComponents([
				row.components.map((component) => {
					switch (component.type) {
						case 2:
						case "BUTTON":
							const button = new Discord.ButtonBuilder()
								.setEmoji(component.emoji)
								.setLabel(component.label)
								.setStyle(component.style);

							if (component.style === "LINK") button.setURL(component.url);
							else {
								button
									.setCustomId(component.customId || component.custom_id)
									.setDisabled(state);
							}
							// console.log(button);
							return button;

						case 3:
						case "SELECT_MENU":
							// console.log(component)
							return new Discord.StringSelectMenuBuilder()
								.setCustomId(String(component.customId || component.custom_id))
								.setPlaceholder(String(component.placeholder))
								.setMinValues(component.minValues || component.min_values)
								.setMaxValues(component.maxValues || component.max_values)
								.addOptions({
									label: "A",
									value: "B",
									description: "C",
								})
								.setDisabled(state);
					}
				}),
			])
		);
		// console.log(COMPONENTS)
		return COMPONENTS;
	};

	client.string = require("./string");

	client.actionlog = async (
		action,
		detail = null,
		actor = null,
		victim = null
	) => {
		const sdb = client.db.table("settings");

		if (!(await sdb.has("actionWebhookURL"))) return;
		const actionWebhookURL = await sdb.get("actionWebhookURL");
		const webhookClient = new Discord.WebhookClient({ url: actionWebhookURL });

		const Embed = new Discord.EmbedBuilder()
			.setColor("Random")
			.setTitle(action)
			.setTimestamp();

		if (detail !== null) Embed.setDescription(detail);

		if (actor !== null)
			Embed.setAuthor({
				name: actor.name || actor,
				iconURL: actor.iconURL || undefined,
			});

		if (victim !== null)
			Embed.setFooter({
				text: victim.name || victim,
				iconURL: victim.iconURL || undefined,
			});

		await webhookClient.send({
			username: `${client.user.username} log`,
			avatarURL: client.user.displayAvatarURL(),
			embeds: [Embed],
		});
	};

	// client.prefix = require("../configuration/guildPrefix");

	// client.locale = require("../configuration/guildLocale");
};
