/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['avatars.githubusercontent.com'],
	},
	webpack: (config, { isServer }) => {
		config.module.rules.push({
			test: /\.node$/,
			use: 'node-loader',
		});

		return config;
	},
};

export default nextConfig;
