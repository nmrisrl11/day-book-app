import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportBirthdays } from "@/helpers/import-export";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDayBookStore } from "@/store/day-book-store";
import {
	ArrowLeftIcon,
	DatabaseIcon,
	MessageSquareIcon,
	PaintbrushIcon,
	StarIcon,
	UserCircleIcon,
	Volume2Icon,
} from "lucide-react";
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
const MainGreetingSection = lazy(() =>
	import("./main-greeting-section").then((m) => ({ default: m.MainGreetingSection })),
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
const SoundSettingsSection = lazy(() =>
	import("./sound-settings-section").then((m) => ({ default: m.SoundSettingsSection })),
);

export function SettingsScreen() {
	const { birthdays, deleteAllBirthdays } = useDayBookStore();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const navigate = useNavigate();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const handleConfirmDeleteAll = () => {
		deleteAllBirthdays();
		setDeleteModalOpen(false);
	};

	const handleExport = () => {
		exportBirthdays(birthdays);
	};

	const tabs = [
		{ id: "appearance", label: "Appearance", icon: PaintbrushIcon },
		{ id: "main-greeting", label: "Main Greeting", icon: StarIcon },
		{ id: "avatar", label: "Avatar", icon: UserCircleIcon },
		{
			id: "messages",
			label: "Messages & Greetings",
			icon: MessageSquareIcon,
		},
		{ id: "sounds", label: "Sound & Feedback", icon: Volume2Icon },
		{ id: "data", label: "Data Management", icon: DatabaseIcon },
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
					<ArrowLeftIcon className="h-5 w-5" />
				</Button>
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
					<p className="text-muted-foreground">Manage your preferences and data.</p>
				</div>
			</div>

			<Tabs
				defaultValue="appearance"
				orientation={isDesktop ? "vertical" : "horizontal"}
				className="relative flex flex-col gap-8 md:flex-row"
			>
				<div className="relative w-full max-w-full shrink-0 md:sticky md:top-6 md:h-fit md:w-64 md:self-start">
					<div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r to-transparent md:hidden" />
					<div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l to-transparent md:hidden" />
					<TabsList
						variant="line"
						className="border-border scrollbar-hide relative flex h-auto w-full snap-x justify-start gap-2 overflow-x-auto overflow-y-hidden px-4 pb-2 md:w-full md:flex-col md:border-r md:px-0 md:pr-6 md:pb-0"
					>
						{tabs.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className="relative flex shrink-0 snap-start items-center gap-3 px-4 py-3 text-sm whitespace-nowrap group-data-[orientation=vertical]/tabs:justify-start data-[state=active]:font-semibold md:py-2.5"
							>
								<tab.icon className="h-4 w-4" />
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
				</div>

				<div className="min-w-0 flex-1">
					<div className="border-border bg-card flex flex-col gap-8 rounded-xl border p-6 shadow-sm">
						<Suspense fallback={<div className="bg-muted h-32 animate-pulse rounded-xl"></div>}>
							<div className="flex flex-col gap-8">
								<TabsContent value="appearance" className="space-y-8">
									<ThemeSection />
									<DisplaySettingsSection />
								</TabsContent>
								<TabsContent value="main-greeting">
									<MainGreetingSection />
								</TabsContent>
								<TabsContent value="avatar">
									<AvatarSettingsSection />
								</TabsContent>
								<TabsContent value="messages" className="space-y-8">
									{birthdays.length > 0 ? (
										<>
											<FloatingMessagesManager />
											<GreetingsManager />
										</>
									) : (
										<div className="flex flex-col items-center justify-center py-12 text-center">
											<MessageSquareIcon className="text-muted-foreground/50 mb-4 h-12 w-12" />
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
									)}
								</TabsContent>
								<TabsContent value="sounds">
									<SoundSettingsSection />
								</TabsContent>
								<TabsContent value="data" className="space-y-8">
									<DataManagementSection />
									{birthdays.length > 0 && (
										<DangerZoneSection onDeleteAllClick={() => setDeleteModalOpen(true)} />
									)}
								</TabsContent>
							</div>
						</Suspense>
					</div>
				</div>
			</Tabs>

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
