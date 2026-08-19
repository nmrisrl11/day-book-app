export const config = {
	runtime: "edge",
};

export default async function handler(request: Request) {
	const url = new URL(request.url);

	try {
		// Fetch the base HTML from the same host to get the latest index.html
		const origin = `${url.protocol}//${url.host}`;
		const response = await fetch(`${origin}/index.html`);

		if (!response.ok) {
			return new Response("Failed to load index.html", { status: 500 });
		}

		let html = await response.text();

		// Replace the generic OG image with route-specific ones
		if (url.pathname.startsWith("/invite")) {
			html = html.replace(/\/og-image\.png/g, "/invite-preview.png");
		} else if (url.pathname.startsWith("/response")) {
			html = html.replace(/\/og-image\.png/g, "/response-preview.png");
		}

		return new Response(html, {
			status: 200,
			headers: {
				"Content-Type": "text/html; charset=utf-8",
				// Prevent caching at the CDN edge so it always serves the right image
				"Cache-Control": "public, max-age=0, must-revalidate",
			},
		});
	} catch (error) {
		console.error("Error rewriting OG tags:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
