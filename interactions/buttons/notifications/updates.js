module.exports = {
	id: "updates",
	async execute(interaction) {
		const { guild, message } = interaction;

		const role =
			(await guild.roles.cache.find((r) => r.name.toLowerCase() == this.id)) ||
			(await guild.roles.create({
				name: this.id,
				reason: "Create " + this.id + "role for pingPanel",
			}));

		const member =
			(await guild.members.fetch(interaction.user.id)) ||
			(await guild.members.cache.get(interaction.user.id));

        const label = message.components[0].components.find(b => b.customId == this.id).label

		try {
			if (member.roles.cache.find((r) => r.name.toLowerCase() == this.id)) {
				member.roles.remove(role);
				await interaction.reply({
					content: `❌ Bạn vừa hủy đăng ký nhận thông báo **${label}** :<`,
					ephemeral: true,
				});
			} else {
				member.roles.add(role);
				await interaction.reply({
					content: `📣 Bạn vừa đăng ký nhận thông báo **${label}**!`,
					ephemeral: true,
				});
			}
		} catch (e) {
			await interaction.reply({
				content:
					"Đã có lỗi xảy ra, vui lòng báo cho admin!\n```" + e.message + "```",
				ephemeral: true,
			});
		}
	},
};
