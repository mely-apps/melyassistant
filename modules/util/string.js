module.exports = {
	isSuitable: function (s) {
		if (this.validateSC(s.charAt(0)) || this.validateEmoji(s.charAt(0)))
			return false;
		if (this.isFullofZalgo(s) || this.isFullofEmoji(s)) return false;
		if (this.isFullofAlphabetNumeric(s)) return true;
		if (this.validateVietnamese(s)) {
			if (
				this.isFullofAlphabetNumeric(
					this.removeAccents(this.removeSC(this.removeEmoji(s)))
				)
			)
				return true;
		} else if (this.isFullofAlphabetNumeric(this.removeSC(this.removeEmoji(s))))
			return true;

		return false;
	},

	removeSC: function (s) {
		return s.replace(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, "");
	},

	validateSC: function (s) {
		return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g.test(s);
	},

	isAlphabetNumeric: function (str) {
		return /^[A-Za-z0-9]/g.test(str);
	},

	removeAlphabetNumeric: function (str) {
		return str.replace(/[A-Za-z0-9]/g, "");
	},

	isFullofAlphabetNumeric: function (str) {
		return /^[A-Za-z0-9]+$/g.test(str);
	},

	removeAccents: function (str) {
		return String(str)
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/đ/g, "d")
			.replace(/Đ/g, "D");
	},

	validateZalgo: function (s) {
		return /%CC%/g.test(encodeURIComponent(s));
	},
	// /%CC%/
	isFullofZalgo: function (s) {
		s = this.removeVietnamese(s);
		s = this.removeAlphabetNumeric(s);
		s = this.removeSC(s);
		s = this.removeEmoji(s);
		return /^%CC%+$/g.test(encodeURIComponent(s));
	},

	removeZalgo: function (s) {
		return decodeURIComponent(
			encodeURIComponent(s)
				.replace(/%CC(%[A-Z0-9]{2})+%20/g, " ")
				.replace(/%CC(%[A-Z0-9]{2})+(\w)/g, "$2")
		);
	},

	removeEmoji: function (s) {
		return s.replace(
			/(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
			""
		);
	},

	validateEmoji: function (s) {
		return /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g.test(
			s
		);
	},

	isFullofEmoji: function (s) {
		return /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])+$/g.test(
			s
		);
	},

	validateVietnamese: function (s) {
		return /[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêệìíòóôõọùúýĂăĐđĨĩŨũƠơƯưạẠ-ỹ]+/g.test(s);
	},

	removeVietnamese: function (s) {
		return s.replace(
			/[ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêệìíòóôõọùúýĂăĐđĨĩŨũƠơƯưạẠ-ỹ]/g,
			""
		);
	},
};
