module.exports = {
	apps: [
		{
			name: "MeLy",
			script: "./build/main.js",
			env_production: {
				NODE_ENV: "production",
			},
			env_development: {
				NODE_ENV: "development",
			},
			watch: true,
		},
	],
};
