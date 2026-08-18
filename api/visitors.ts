export const config = {
	runtime: "edge",
};

export default async function handler(req: Request) {
	const REDIS_URL = process.env.KV_REST_API_URL;
	const REDIS_TOKEN = process.env.KV_REST_API_TOKEN;

	if (!REDIS_URL || !REDIS_TOKEN) {
		// Return graceful fallback if Redis is not set up yet
		return new Response(JSON.stringify({ total: 0 }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const url = new URL(req.url);
		const shouldTrack = url.searchParams.get("track") === "1";
		let totalVisitors = 0;

		if (shouldTrack) {
			// Increment the total visitors counter by 1
			const res = await fetch(`${REDIS_URL}/incr/daybook_visitors_total`, {
				headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
			});
			totalVisitors = await res.json();
		} else {
			// Just fetch the current count without incrementing
			const res = await fetch(`${REDIS_URL}/get/daybook_visitors_total`, {
				headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
			});
			const data = await res.json();
			totalVisitors = data?.result ? parseInt(data.result, 10) : 0;
		}

		return new Response(JSON.stringify({ total: totalVisitors }), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new Response(JSON.stringify({ total: 0, error: "Failed to fetch stats" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
