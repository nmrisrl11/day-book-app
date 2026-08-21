import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import { VitePWA } from "vite-plugin-pwa";
import { APP_INFO } from "./src/constants/app-info.ts";

const htmlPlugin = () => {
	return {
		name: "html-transform",
		transformIndexHtml(html: string) {
			return html
				.replace(/%APP_TITLE%/g, APP_INFO.title)
				.replace(/%APP_DESCRIPTION%/g, APP_INFO.description)
				.replace(/%APP_KEYWORDS%/g, APP_INFO.keywords)
				.replace(/%APP_THEME_COLOR%/g, APP_INFO.themeColor)
				.replace(/%APP_NAME%/g, APP_INFO.name)
				.replace(/%APP_AUTHOR%/g, APP_INFO.author);
		},
	};
};

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
	const isProduction = command === "build" || mode === "production";
	const vercelEnv = process.env.VERCEL_ENV || (isProduction ? "production" : "development");

	return {
		define: {
			"import.meta.env.VITE_VERCEL_ENV": JSON.stringify(vercelEnv),
		},
		// build config omitted to allow Rollup to handle chunking dynamically
		plugins: [
			htmlPlugin(),
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
					name: APP_INFO.name,
					short_name: APP_INFO.shortName,
					description: APP_INFO.description,
					theme_color: APP_INFO.themeColor,
					background_color: APP_INFO.backgroundColor,
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
					globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}"],
					runtimeCaching: [
						{
							urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
							handler: "CacheFirst",
							options: {
								cacheName: "google-fonts-cache",
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60 * 24 * 365,
								},
								cacheableResponse: {
									statuses: [0, 200],
								},
							},
						},
						{
							urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
							handler: "CacheFirst",
							options: {
								cacheName: "gstatic-fonts-cache",
								expiration: {
									maxEntries: 10,
									maxAgeSeconds: 60 * 60 * 24 * 365,
								},
								cacheableResponse: {
									statuses: [0, 200],
								},
							},
						},
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
				"@": path.resolve(import.meta.dirname, "./src"),
			},
		},
	};
});
