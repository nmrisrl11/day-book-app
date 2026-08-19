export const config = {
	runtime: "edge",
};

async function hashIp(ip: string): Promise<string> {
	const data = new TextEncoder().encode(ip);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

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
		// Get client IP and hash it for privacy-first bot mitigation (no raw IPs stored)
		const ip = req.headers.get("x-forwarded-for") || "unknown";
		const hashedIp = await hashIp(ip);

		// Atomic check-and-set: Lock this anonymized IP for 24 hours (86400 seconds)
		const lockRes = await fetch(`${REDIS_URL}/set/daybook_visit_${hashedIp}/1/EX/86400/NX`, {
			headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
		});
		const lockData = await lockRes.json();
		const isNewVisit = lockData?.result === "OK";

		let totalVisitors = 0;

		if (isNewVisit) {
			// Increment the total visitors counter by 1
			const res = await fetch(`${REDIS_URL}/incr/daybook_visitors_total`, {
				headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
			});
			const data = await res.json();
			totalVisitors = data?.result ? parseInt(data.result, 10) : 0;
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
