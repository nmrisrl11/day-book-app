import { APP_INFO } from "./app-info";

export const SEO_CONFIG = {
	defaultTitle: APP_INFO.title,
	defaultDescription: APP_INFO.description,
	defaultType: "website" as const,
	defaultImage: "/og-image.png",
	defaultTwitterCard: "summary_large_image" as const,
};
