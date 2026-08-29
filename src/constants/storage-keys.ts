export const STORAGE_KEYS = {
	ZUSTAND_STORE: "ZGF5Ym9vay1zdG9yYWdl", // daybook-storage
	HAS_DATA: "ZGF5Ym9va19oYXNfZGF0YQ", // daybook_has_data
	HAS_INVITATIONS: "ZGF5Ym9va19oYXNfaW52aXRhdGlvbnM", // daybook_has_invitations
	LEGACY_SETTINGS: "ZGF5Ym9va19zZXR0aW5ncw", // daybook_settings
};

export function migrateStorageKeys() {
	if (typeof window === "undefined" || !window.localStorage) return;

	try {
		// Migrate Zustand store
		const oldStore = localStorage.getItem("daybook-storage");
		if (oldStore) {
			localStorage.setItem(STORAGE_KEYS.ZUSTAND_STORE, oldStore);
			localStorage.removeItem("daybook-storage");
		}

		// Migrate has_data
		const oldHasData = localStorage.getItem("daybook_has_data");
		if (oldHasData) {
			localStorage.setItem(STORAGE_KEYS.HAS_DATA, oldHasData);
			localStorage.removeItem("daybook_has_data");
		}

		// Migrate has_invitations
		const oldHasInvitations = localStorage.getItem("daybook_has_invitations");
		if (oldHasInvitations) {
			localStorage.setItem(STORAGE_KEYS.HAS_INVITATIONS, oldHasInvitations);
			localStorage.removeItem("daybook_has_invitations");
		}

		// Migrate legacy settings
		const oldSettings = localStorage.getItem("daybook_settings");
		if (oldSettings) {
			localStorage.setItem(STORAGE_KEYS.LEGACY_SETTINGS, oldSettings);
			localStorage.removeItem("daybook_settings");
		}
	} catch (error) {
		console.error("Failed to migrate storage keys:", error);
	}
}
