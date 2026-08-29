export const STORAGE_KEYS = {
	ZUSTAND_STORE: "ZGF5Ym9vay1zdG9yYWdl", // daybook-storage
	HAS_DATA: "ZGF5Ym9va19oYXNfZGF0YQ", // daybook_has_data
	HAS_INVITATIONS: "ZGF5Ym9va19oYXNfaW52aXRhdGlvbnM", // daybook_has_invitations
	LEGACY_SETTINGS: "ZGF5Ym9va19zZXR0aW5ncw", // daybook_settings
};

export function migrateStorageKeys() {
	if (typeof window === "undefined") return;

	try {
		const storage = window.localStorage;
		if (!storage) return;

		// Migrate Zustand store
		const newStore = storage.getItem(STORAGE_KEYS.ZUSTAND_STORE);
		const oldStore = storage.getItem("daybook-storage");
		if (oldStore !== null && newStore === null) {
			storage.setItem(STORAGE_KEYS.ZUSTAND_STORE, oldStore);
		}
		if (storage.getItem(STORAGE_KEYS.ZUSTAND_STORE) !== null) {
			storage.removeItem("daybook-storage");
		}

		// Migrate has_data
		const newHasData = storage.getItem(STORAGE_KEYS.HAS_DATA);
		const oldHasData = storage.getItem("daybook_has_data");
		if (oldHasData !== null && newHasData === null) {
			storage.setItem(STORAGE_KEYS.HAS_DATA, oldHasData);
		}
		if (storage.getItem(STORAGE_KEYS.HAS_DATA) !== null) {
			storage.removeItem("daybook_has_data");
		}

		// Migrate has_invitations
		const newHasInvitations = storage.getItem(STORAGE_KEYS.HAS_INVITATIONS);
		const oldHasInvitations = storage.getItem("daybook_has_invitations");
		if (oldHasInvitations !== null && newHasInvitations === null) {
			storage.setItem(STORAGE_KEYS.HAS_INVITATIONS, oldHasInvitations);
		}
		if (storage.getItem(STORAGE_KEYS.HAS_INVITATIONS) !== null) {
			storage.removeItem("daybook_has_invitations");
		}

		// Migrate legacy settings
		const newSettings = storage.getItem(STORAGE_KEYS.LEGACY_SETTINGS);
		const oldSettings = storage.getItem("daybook_settings");
		if (oldSettings !== null && newSettings === null) {
			storage.setItem(STORAGE_KEYS.LEGACY_SETTINGS, oldSettings);
		}
		if (storage.getItem(STORAGE_KEYS.LEGACY_SETTINGS) !== null) {
			storage.removeItem("daybook_settings");
		}
	} catch (error) {
		console.error("Failed to migrate storage keys:", error);
	}
}
