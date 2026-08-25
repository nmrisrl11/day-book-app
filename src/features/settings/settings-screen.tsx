import { AnimateIcon } from "@/components/ui/animate-icon";
import { MessageSquareIcon } from "@/components/ui/animated-icons/message-square-icon";
import { PaintbrushIcon } from "@/components/ui/animated-icons/paintbrush-icon";
import { StarIcon } from "@/components/ui/animated-icons/star-icon";
import { UserRoundIcon as UserCircleIcon } from "@/components/ui/animated-icons/user-round-icon";
import { Volume2Icon } from "@/components/ui/animated-icons/volume-2-icon";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportBirthdays } from "@/helpers/import-export";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BirthdayRepository } from "@/lib/birthday-repository";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeftIcon, DatabaseIcon, DownloadIcon } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { lazy, Suspense, useEffect, useRef, useState, type ElementType } from "react";
import { useNavigate } from "react-router-dom";

const FloatingMessagesManager = lazy(() =>
	import("./components/messages/floating-messages-manager").then((m) => ({
		default: m.FloatingMessagesManager,
	})),
);
const GreetingsManager = lazy(() =>
	import("./components/messages/greetings-manager").then((m) => ({ default: m.GreetingsManager })),
);
const DeleteConfirmationModal = lazy(() =>
	import("@/components/delete-confirmation-modal").then((m) => ({
		default: m.DeleteConfirmationModal,
	})),
);
const ThemeSection = lazy(() =>
	import("./components/appearance/theme-section").then((m) => ({ default: m.ThemeSection })),
);
const MainGreetingSection = lazy(() =>
	import("./components/main-greeting/main-greeting-section").then((m) => ({
		default: m.MainGreetingSection,
	})),
);
const DisplaySettingsSection = lazy(() =>
	import("./components/appearance/display-settings-section").then((m) => ({
		default: m.DisplaySettingsSection,
	})),
);
const AvatarSettingsSection = lazy(() =>
	import("./components/avatar/avatar-settings-section").then((m) => ({
		default: m.AvatarSettingsSection,
	})),
);
const DataManagementSection = lazy(() =>
	import("./components/data/data-management-section").then((m) => ({
		default: m.DataManagementSection,
	})),
);
const DangerZoneSection = lazy(() =>
	import("./components/data/danger-zone-section").then((m) => ({ default: m.DangerZoneSection })),
);
const SoundSettingsSection = lazy(() =>
	import("./components/sound/sound-settings-section").then((m) => ({
		default: m.SoundSettingsSection,
	})),
);

type SettingsTab = {
	id: string;
	label: string;
	icon: ElementType;
	isAnimated: boolean;
};

const AnimatedTabTrigger = ({ tab, isActiveTab }: { tab: SettingsTab; isActiveTab: boolean }) => {
	const triggerRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (isActiveTab && triggerRef.current) {
			triggerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
		}
	}, [isActiveTab]);

	const trigger = (
		<TabsTrigger
			ref={triggerRef}
			value={tab.id}
			className="relative flex shrink-0 snap-start items-center gap-3 px-4 py-3 text-sm whitespace-nowrap group-data-[orientation=vertical]/tabs:justify-start data-[state=active]:font-semibold md:py-2.5"
		>
			<tab.icon className="h-4 w-4" aria-hidden="true" />
			{tab.label}
		</TabsTrigger>
	);

	if (tab.isAnimated) {
		return (
			<AnimateIcon animateOnHover animateOnTap asChild>
				{trigger}
			</AnimateIcon>
		);
	}

	return trigger;
};

export function SettingsScreen() {
	const birthdays = useLiveQuery(() => db.birthdays.toArray(), []) ?? [];
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const navigate = useNavigate();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	const [activeTab, setActiveTab] = useQueryState("tab", parseAsString.withDefault("appearance"));

	const handleConfirmDeleteAll = async () => {
		await BirthdayRepository.deleteAll();
		setDeleteModalOpen(false);
	};

	const handleExport = () => {
		exportBirthdays(birthdays);
	};

	const tabs = [
		{ id: "appearance", label: "Appearance", icon: PaintbrushIcon, isAnimated: true },
		{ id: "avatar", label: "Avatar", icon: UserCircleIcon, isAnimated: true },
		{ id: "main-greeting", label: "Main Greeting", icon: StarIcon, isAnimated: true },
		{
			id: "messages",
			label: "Messages & Greetings",
			icon: MessageSquareIcon,
			isAnimated: true,
		},
		{ id: "sounds", label: "Sound & Feedback", icon: Volume2Icon, isAnimated: true },
		{ id: "data", label: "Data Management", icon: DatabaseIcon, isAnimated: false },
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
					<ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
				</Button>
				<div>
					<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
					<p className="text-muted-foreground">Manage your preferences and data.</p>
				</div>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				orientation={isDesktop ? "vertical" : "horizontal"}
				className="relative flex flex-col gap-8 md:flex-row"
			>
				<div className="relative w-full max-w-full shrink-0 md:sticky md:top-6 md:h-fit md:w-64 md:self-start">
					<div className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-linear-to-r to-transparent md:hidden" />
					<div className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l to-transparent md:hidden" />
					<ScrollArea orientation="horizontal" className="w-full">
						<TabsList
							variant="line"
							className="border-border relative flex h-auto w-max snap-x justify-start gap-2 px-4 pb-2 md:w-full md:flex-col md:border-r md:px-0 md:pr-6 md:pb-0"
						>
							{tabs.map((tab) => (
								<AnimatedTabTrigger key={tab.id} tab={tab} isActiveTab={activeTab === tab.id} />
							))}
						</TabsList>
					</ScrollArea>
				</div>

				<div className="min-w-0 flex-1">
					<div className="border-border bg-card flex flex-col gap-8 rounded-xl border p-6 shadow-sm">
						<Suspense
							fallback={<div className="bg-muted/50 h-100 w-full animate-pulse rounded-xl" />}
						>
							<div className="flex flex-col gap-8">
								<TabsContent value="appearance" className="space-y-6">
									<ThemeSection />
									<DisplaySettingsSection />
								</TabsContent>
								<TabsContent value="main-greeting">
									<MainGreetingSection />
								</TabsContent>
								<TabsContent value="avatar">
									<AvatarSettingsSection />
								</TabsContent>
								<TabsContent value="messages" className="space-y-6">
									{birthdays.length > 0 ? (
										<>
											<FloatingMessagesManager />
											<GreetingsManager />
										</>
									) : (
										<div className="flex flex-col items-center justify-center py-12 text-center">
											<MessageSquareIcon
												className="text-muted-foreground/50 mb-4 h-12 w-12"
												aria-hidden="true"
											/>
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
								<TabsContent value="data" className="space-y-6">
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
						title="Delete All Birthdays"
						description={
							<div className="flex flex-col gap-4">
								<p>
									Are you sure you want to delete{" "}
									<span className="text-foreground font-semibold">ALL</span> birthdays? This action
									cannot be undone.
								</p>
								<div className="bg-muted/50 rounded-lg border p-3">
									<p className="mb-3 text-sm">
										Before deleting, you can export your data to a file as a backup.
									</p>
									<Button
										variant="secondary"
										onClick={handleExport}
										aria-label="Export Data"
										className="w-full"
									>
										<DownloadIcon className="mr-2 h-4 w-4" />
										Export Data
									</Button>
								</div>
							</div>
						}
						footer={
							<>
								<Button
									id="cancel-delete-btn"
									variant="ghost"
									onClick={() => setDeleteModalOpen(false)}
								>
									Cancel
								</Button>
								<Button
									variant="destructive"
									onClick={handleConfirmDeleteAll}
									aria-label="Delete All"
								>
									Delete All
								</Button>
							</>
						}
					/>
				</Suspense>
			)}
		</div>
	);
}
