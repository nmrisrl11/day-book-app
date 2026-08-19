import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	define: {
		"import.meta.env.VITE_VERCEL_ENV": JSON.stringify(process.env.VERCEL_ENV || "development"),
	},
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "prompt",
			devOptions: {
				enabled: true,
				suppressWarnings: true,
				type: "module",
			},
			injectRegister: "auto",
			includeAssets: ["favicon.ico", "apple-touch-icon.png"],
			manifest: {
				name: "DayBook",
				short_name: "DayBook",
				description:
					"DayBook is your personal birthday manager. Keep track of family, friends, and loved ones' birthdays so you never forget a special day again.",
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				icons: [
					{
						src: "web-app-manifest-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any maskable",
					},
					{
						src: "web-app-manifest-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
				runtimeCaching: [
					{
						urlPattern: /^\/api\/.*/i,
						handler: "NetworkOnly",
						options: {
							backgroundSync: {
								name: "api-queue",
								options: {
									maxRetentionTime: 24 * 60,
								},
							},
						},
					},
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
