import { APP_INFO } from "@/constants/app-info";
import { SEO_CONFIG } from "@/constants/seo";
import { Helmet } from "react-helmet-async";

export type SEOProps = {
	title?: string;
	description?: string;
	canonical?: string;
	type?: "website" | "article";
	image?: string;
	robots?: string;
};

export function SEO({
	title,
	description = SEO_CONFIG.defaultDescription,
	canonical,
	type = SEO_CONFIG.defaultType,
	image = SEO_CONFIG.defaultImage,
	robots,
}: SEOProps) {
	const siteName = APP_INFO.name;

	// Only append " — DayBook" if the title isn't already the default title.
	// We handle the homepage which usually just passes no title or a specific short title.
	const pageTitle = title ? `${title} — ${siteName}` : SEO_CONFIG.defaultTitle;

	// Search engines and social media bots strongly prefer absolute URLs.
	// Since this is a client-side SPA, we can dynamically get the current domain using window.location.origin
	const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

	// Helper to ensure URLs are absolute
	const getAbsoluteUrl = (path: string) => {
		if (path.startsWith("http")) return path;
		return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
	};

	const absoluteImage = getAbsoluteUrl(image);
	const absoluteCanonical = canonical ? getAbsoluteUrl(canonical) : undefined;

	return (
		<Helmet>
			<title>{pageTitle}</title>
			<meta name="description" content={description} />
			{robots && <meta name="robots" content={robots} />}
			{absoluteCanonical && <link rel="canonical" href={absoluteCanonical} />}

			{/* Open Graph */}
			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content={type} />
			<meta property="og:image" content={absoluteImage} />
			{absoluteCanonical && <meta property="og:url" content={absoluteCanonical} />}

			{/* Twitter */}
			<meta name="twitter:card" content={SEO_CONFIG.defaultTwitterCard} />
			<meta name="twitter:title" content={pageTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={absoluteImage} />
		</Helmet>
	);
}
