const Discord = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("checkname")
		.setDescription("Kiểm tra xem tên có hợp lệ?")
		.addUserOption((option) =>
			option.setName("user").setDescription("Chọn người dùng")
		),

	async execute(interaction) {
		const { client, guild } = interaction;

		const member = interaction.options.getMember("user") || interaction.member;

		return await interaction.reply({
			content: `${result(
				isSuitable(client.displayName(member).toLowerCase()),
				member
			)}`,
			ephemeral: true,
		});

		function result(state = true, member) {
			const displayName = client.displayName(member);
			return state
				? `Tên \`${displayName}\` hợp lệ.`
				: `Tên \`${displayName}\` không hợp lệ.`;
		}
	},
};

function isSuitable(s) {
	if (validateSC(s.charAt(0)) || validateEmoji(s.charAt(0))) return false;
	if (isFullofZalgo(s) || isFullofEmoji(s)) return false;
	if (isFullofAlphabetNumeric(s)) return true;
	if (validateVietnamese(s)) {
		if (isFullofAlphabetNumeric(removeAccents(removeSC(removeEmoji(s)))))
			return true;
	} else if (isFullofAlphabetNumeric(removeSC(removeEmoji(s)))) return true;

	return false;
}

function removeSC(s) {
	return s.replace(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, "");
}

function validateSC(s) {
	return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g.test(s);
}

function isAlphabetNumeric(str) {
	return /^[A-Za-z0-9]/g.test(str);
}

function isFullofAlphabetNumeric(str) {
	return /^[A-Za-z0-9]+$/g.test(str);
}

function removeAccents(str) {
	return String(str)
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/đ/g, "d")
		.replace(/Đ/g, "D");
}

function validateZalgo(s) {
	return /[^\u+0300-\u+036F]/.test(s);
}

function isFullofZalgo(s) {
	return /^[^\u+0300-\u+036F]+$/.test(s);
}

function removeEmoji(s) {
	return s.replace(
		/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
		""
	);
}

function validateEmoji(s) {
	return /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g.test(
		s
	);
}

function isFullofEmoji(s) {
	return /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/g.test(
		s
	);
}

function validateVietnamese(s) {
	return /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêệìíòóôõọùúýĂăĐđĨĩŨũƠơƯưạẠ-ỹ]+/g.test(s);
}

