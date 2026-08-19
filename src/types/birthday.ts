export const RELATIONSHIP_OPTIONS = ["Family", "Friend", "Partner", "Colleague", "Other"] as const;

export type Relationship = (typeof RELATIONSHIP_OPTIONS)[number];

export type Birthday = {
	id: string;
	name: string;
	birthday: string; // YYYY-MM-DD
	avatar?: string;
	relationship: Relationship | string;
	notes: string[];
};
