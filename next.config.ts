import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	serverExternalPackages: ['pino', 'pino-pretty'],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
				port: "",
				pathname: "/**",
			},
		],
	},
};

export default nextConfig;
