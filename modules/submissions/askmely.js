const Discord = require("discord.js");

module.exports = async (client, guild, user, question, anonymous = false) => {
	try {
		const db = client.db.askmely;

		const askmelyChannel = await guild.channels.cache.find((c) =>
			c.name.toLowerCase().includes("ask-mely")
		);

		if (!(await db.has(user.id))) await db.set(user.id, []);

		const data = {
			question: question,
			timestamp: Date.now(),
		};

		await db.push(user.id, data);
		let questions = await db.all();
		let questionsFlatArray = Object.values(questions).flat();
		let userQuestions = await db.get(user.id);

		const askmelyEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setAuthor({
				name: user.tag,
				iconURL: user.displayAvatarURL({ dynamic: true }),
			})
			.setTitle("ASK MELY #" + questionsFlatArray.length)
			.setDescription(data.question)
			.setFooter({
				text: `User's ID: ${user.id} | User's total questions: ${userQuestions.length}`,
			})
			.setTimestamp(data.timestamp);

		if (anonymous === true) {
			const submissionChannel = await guild.channels.cache.find((c) =>
				c.name.toLowerCase().includes("submissions")
			);

			const anonymousEmbed = new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setAuthor({
					name: `Ẩn danh`,
					iconURL: `https://cdn.discordapp.com/attachments/853947039985696770/982137393945645086/unknown.png`,
				})
				.setTitle("ASK MELY #" + questionsFlatArray.length)
				.setDescription(data.question)
				.setTimestamp(data.timestamp);

			await submissionChannel.send({
				embeds: [askmelyEmbed],
			});

			await askmelyChannel.send({
				embeds: [anonymousEmbed],
			});
		} else {
			await askmelyChannel.send({
				embeds: [askmelyEmbed],
			});
		}

		return 0;
	} catch (error) {
		console.log(error);
		return -1;
	}
};
