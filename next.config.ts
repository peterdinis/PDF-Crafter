import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	transpilePackages: ["framer-motion", "konva", "jspdf", "lucide-react", "react-konva", "react-signature-canvas", "uuid", "clsx"],
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
	experimental: {
		optimizeCss: true,
		optimisticClientCache: true
	}
};

export default nextConfig;
