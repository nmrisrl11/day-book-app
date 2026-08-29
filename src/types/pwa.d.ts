// The BeforeInstallPromptEvent is not fully standard yet, so we define it here
interface BeforeInstallPromptEvent extends Event {
	readonly platforms: Array<string>;
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
	prompt(): Promise<void>;
}

interface Window {
	__hasInstallListener?: boolean;
	__deferredPrompt?: BeforeInstallPromptEvent | null;
	__isInstallable?: boolean;
}
