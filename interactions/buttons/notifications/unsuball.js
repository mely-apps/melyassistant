module.exports = {
	id: "unsuball",
	async execute(interaction) {
		const { guild, message } = interaction;

		const member =
			(await guild.members.fetch(interaction.user.id)) ||
			(await guild.members.cache.get(interaction.user.id));

		const notiNames = ["announcements", "events", "updates"];

		const notiRoles = await guild.roles.cache.filter((r) =>
			notiNames.includes(r.name.toLowerCase())
		);

		try {
			member.roles.remove(notiRoles);
			await interaction.reply({
				content: `❌ Bạn vừa hủy đăng ký nhận tất cả thông báo :<`,
				ephemeral: true,
			});
		} catch (e) {
			await interaction.reply({
				content:
					"Đã có lỗi xảy ra, vui lòng báo cho admin!\n```" + e.message + "```",
				ephemeral: true,
			});
		}
	},
};
