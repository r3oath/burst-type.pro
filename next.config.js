/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable unicorn/prefer-module */
/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: '/migrate',
				destination: '/',
				permanent: true,
			},
		];
	},
};

module.exports = nextConfig;
