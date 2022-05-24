module.exports = {
	id: "pingdrop",
	async execute(interaction) {
		const { guild, message, values } = interaction;

		const member =
			(await guild.members.fetch(interaction.user.id)) ||
			(await guild.members.cache.get(interaction.user.id));

		const notiNames = ["announcements", "events", "updates"];

		const notiRoles = await guild.roles.cache.filter((r) =>
			notiNames.includes(r.name.toLowerCase())
		);

		if (!values || values.length <= 0)
			return member.roles.remove(notiRoles).then(() => {
				interaction.reply({
					content: `❌ Bạn vừa hủy đăng ký nhận tất cả thông báo :<`,
					ephemeral: true,
				});
			});
		else if (values.length == notiRoles.size)
			return member.roles.add(notiRoles).then(() => {
				interaction.reply({
					content: `✅ Bạn vừa đăng ký nhận tất cả thông báo!`,
					ephemeral: true,
				});
			});

		const rolesInput = notiRoles.filter((r) =>
			values.includes(r.name.toLowerCase())
		);

		// const memRoles = await member.roles.cache.filter((r) =>
		// 	values.includes(r.name.toLowerCase())
		// );

		try {
			let content = [""];

			const rolesToSub = rolesInput;

			const rolesToUnsub = notiRoles.filter((r) => !rolesInput.has(r.id));

			// console.log(rolesToSub.map((r) => r.name));
			// console.log("------------");
			// console.log(rolesToUnsub.map((r) => r.name));

			if (rolesToSub.size > 0) {
				member.roles.add(rolesToSub);
				const thongBao = rolesToSub.map((r) => convert(r.name.toLowerCase()));
				content.push(
					`✅ Bạn vừa đăng ký nhận ${
						thongBao.size <= 1 ? "" : "các "
					}thông báo **${thongBao.join("**, **")}**`
				);
			}

			if (rolesToUnsub.size > 0) {
				member.roles.remove(rolesToUnsub);
				const thongBao = rolesToUnsub.map((r) => convert(r.name.toLowerCase()));
				content.push(
					`❌ Bạn vừa hủy đăng ký nhận ${
						thongBao.size <= 1 ? "" : "các "
					}thông báo **${thongBao.join("**, **")}**`
				);
			}

			const finalContent = await content.join("\n");

			await interaction.reply({
				content: finalContent,
				ephemeral: true,
			});
		} catch (error) {
			await interaction.reply({
				content:
					"Đã có lỗi xảy ra, vui lòng báo cho admin!\n```" +
					error.message +
					"```",
				ephemeral: true,
			});
		}

		// console.log(rolesToSub.map((r) => r.name));
		// console.log("------------");
		// console.log(rolesToUnsub.map((r) => r.name));
		return;
	},
};

const convert = (string) => {
	switch (string) {
		case "announcements":
			return "Chung";
		case "events":
			return "Sự kiện";
		case "updates":
			return "Cập nhật";
	}
};
