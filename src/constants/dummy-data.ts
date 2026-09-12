import type { Birthday } from "@/types/birthday";

export const getDayBookDummyData = (currentDate: Date): Birthday => {
	const monthStr = String(currentDate.getMonth() + 1).padStart(2, "0");
	const dayStr = String(currentDate.getDate()).padStart(2, "0");

	return {
		id: "preview-dummy",
		name: "DayBook",
		birthday: `${currentDate.getFullYear()}-${monthStr}-${dayStr}`,
		relationship: "Friend",
		notes: [
			"Loves remembering special days",
			"Always ready to celebrate!",
			"Built with care and privacy in mind",
		],
		giftIdeas: ["A 5-star review", "Tell your friends about it", "A star on GitHub 🌟"],
	};
};
