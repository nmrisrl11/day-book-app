import { Button } from "@/components/ui/button";
import { exportBirthdays } from "@/helpers/import-export";
import { cn } from "@/lib/utils";
import { useDayBookStore } from "@/store/day-book-store";
import { ArrowLeft, Database, MessageSquare, Paintbrush, UserCircle } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingMessagesManager = lazy(() =>
	import("./floating-messages-manager").then((m) => ({ default: m.FloatingMessagesManager })),
);
const GreetingsManager = lazy(() =>
	import("./greetings-manager").then((m) => ({ default: m.GreetingsManager })),
);
const DeleteConfirmationModal = lazy(() =>
	import("../management/delete-confirmation-modal").then((m) => ({
		default: m.DeleteConfirmationModal,
	})),
);
const ThemeSection = lazy(() =>
	import("./theme-section").then((m) => ({ default: m.ThemeSection })),
);
const DisplaySettingsSection = lazy(() =>
	import("./display-settings-section").then((m) => ({ default: m.DisplaySettingsSection })),
);
const AvatarSettingsSection = lazy(() =>
	import("./avatar-settings-section").then((m) => ({ default: m.AvatarSettingsSection })),
);
const DataManagementSection = lazy(() =>
	import("./data-management-section").then((m) => ({ default: m.DataManagementSection })),
);
const DangerZoneSection = lazy(() =>
	import("./danger-zone-section").then((m) => ({ default: m.DangerZoneSection })),
);

type TabId = "appearance" | "avatar" | "messages" | "data";

export function SettingsScreen() {
	const { birthdays, deleteAllBirthdays } = useDayBookStore();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<TabId>("appearance");
	const navigate = useNavigate();

	const handleConfirmDeleteAll = () => {
		deleteAllBirthdays();
		setDeleteModalOpen(false);
	};

	const handleExport = () => {
		exportBirthdays(birthdays);
	};

	const tabs = [
		{ id: "appearance", label: "Appearance", icon: Paintbrush },
		{ id: "avatar", label: "Avatar", icon: UserCircle },
		{
			id: "messages",
			label: "Messages & Greetings",
			icon: MessageSquare,
		},
		{ id: "data", label: "Data Management", icon: Database },
	];

	return (
		<div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex w-full max-w-5xl flex-col gap-6 pb-12 duration-500">
			<div className="flex items-center gap-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate(-1)}
					className="shrink-0"
					aria-label="Go back"
				>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
					<p className="text-muted-foreground">Manage your preferences and data.</p>
				</div>
			</div>

			<div className="relative flex flex-col gap-8 md:flex-row">
				<div className="relative shrink-0 md:sticky md:top-6 md:h-fit md:w-64">
					<div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r to-transparent md:hidden" />
					<div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l to-transparent md:hidden" />
					<nav className="border-border scrollbar-hide relative flex snap-x gap-2 overflow-x-auto px-4 pb-2 md:flex-col md:border-r md:px-0 md:pr-6 md:pb-0">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as TabId)}
								className={cn(
									"focus-visible:ring-ring relative flex shrink-0 snap-start items-center gap-3 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 md:py-2.5",
									activeTab === tab.id
										? "text-foreground font-semibold"
										: "text-muted-foreground hover:text-foreground hover:bg-secondary/30 rounded-lg",
								)}
							>
								{activeTab === tab.id && (
									<span className="bg-foreground absolute right-4 bottom-0 left-4 h-0.5 rounded-t-full md:top-1 md:right-auto md:bottom-1 md:left-0 md:h-auto md:w-0.5 md:rounded-l-none md:rounded-r-full" />
								)}
								<tab.icon className="h-4 w-4" />
								{tab.label}
							</button>
						))}
					</nav>
				</div>

				<div className="min-w-0 flex-1">
					<div className="border-border bg-card flex flex-col gap-8 rounded-xl border p-6 shadow-sm">
						<Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-xl"></div>}>
							<div className="flex flex-col gap-8">
								{activeTab === "appearance" && (
									<>
										<ThemeSection />
										<DisplaySettingsSection />
									</>
								)}
								{activeTab === "avatar" && <AvatarSettingsSection />}
								{activeTab === "messages" &&
									(birthdays.length > 0 ? (
										<>
											<FloatingMessagesManager />
											<GreetingsManager />
										</>
									) : (
										<div className="flex flex-col items-center justify-center py-12 text-center">
											<MessageSquare className="text-muted-foreground/50 mb-4 h-12 w-12" />
											<h3 className="text-foreground mb-2 text-lg font-semibold">
												No Birthdays Added
											</h3>
											<p className="text-muted-foreground mb-6 max-w-sm text-sm">
												You need to add at least one birthday to manage floating messages and
												greetings.
											</p>
											<Button onClick={() => navigate("/")} variant="default">
												Add Birthday
											</Button>
										</div>
									))}
								{activeTab === "data" && (
									<>
										<DataManagementSection />
										{birthdays.length > 0 && (
											<DangerZoneSection onDeleteAllClick={() => setDeleteModalOpen(true)} />
										)}
									</>
								)}
							</div>
						</Suspense>
					</div>
				</div>
			</div>

			{deleteModalOpen && (
				<Suspense fallback={null}>
					<DeleteConfirmationModal
						open={deleteModalOpen}
						onOpenChange={setDeleteModalOpen}
						onConfirm={handleConfirmDeleteAll}
						isDeleteAll={true}
						onExport={handleExport}
					/>
				</Suspense>
			)}
		</div>
	);
}
