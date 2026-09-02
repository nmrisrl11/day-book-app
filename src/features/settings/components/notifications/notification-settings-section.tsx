import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { APP_INFO } from "@/constants/app-info";
import { useDayBookStore } from "@/store/day-book-store";
import { AlertCircleIcon, BellIcon, BellRingIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function NotificationSettingsSection() {
	const settings = useDayBookStore((state) => state.settings.notificationSettings);
	const updateSettings = useDayBookStore((state) => state.updateSettings);
	const [permission, setPermission] = useState<NotificationPermission>("default");

	useEffect(() => {
		if ("Notification" in window) {
			setPermission(Notification.permission);
		}
	}, []);

	const handleToggleEnabled = async (enabled: boolean) => {
		updateSettings({
			notificationSettings: {
				...settings!,
				enabled,
			},
		});
	};

	const handleRequestPermission = async () => {
		if ("Notification" in window) {
			const res = await Notification.requestPermission();
			setPermission(res);
		}
	};

	const handleDaysBeforeChange = (day: number, checked: boolean) => {
		const currentDays = settings?.remindDaysBefore || [];
		const newDays = checked ? [...currentDays, day] : currentDays.filter((d) => d !== day);

		updateSettings({
			notificationSettings: {
				...settings!,
				remindDaysBefore: newDays.sort((a, b) => a - b),
			},
		});
	};

	const daysOptions = [
		{ value: 0, label: "On the day" },
		{ value: 1, label: "1 day before" },
		{ value: 3, label: "3 days before" },
		{ value: 7, label: "7 days before" },
	];

	return (
		<div className="flex flex-col gap-6">
			<div className="bg-card flex flex-col rounded-xl border">
				<div className="bg-muted/30 flex flex-col gap-1.5 rounded-t-xl border-b p-4">
					<div className="flex items-center justify-between gap-4">
						<h3 className="text-base font-semibold">Notification Settings</h3>
					</div>
					<p className="text-muted-foreground max-w-[85%] text-sm">
						Manage how and when you want to be reminded about upcoming birthdays.
					</p>
				</div>

				<div className="flex flex-col px-4 divide-y">
					<div className="flex flex-col gap-1 py-4">
						<div className="flex items-center justify-between gap-4">
							<Label className="text-sm font-semibold" htmlFor="notifications-enabled">
								Enable Reminders
							</Label>
							<div className="flex shrink-0 items-center">
								<Switch
									id="notifications-enabled"
									checked={settings?.enabled ?? true}
									onCheckedChange={handleToggleEnabled}
								/>
							</div>
						</div>
						<p className="text-muted-foreground max-w-[85%] text-sm">
							Show in-app birthday alerts when {APP_INFO.name} is open.
						</p>
					</div>

					{settings?.enabled && (
						<div className="flex flex-col divide-y">
							<div className="space-y-3 py-4">
								<div className="mb-3 flex flex-col gap-1.5">
									<h3 className="text-sm font-semibold">Remind Me</h3>
									<p className="text-muted-foreground text-sm">
										Select when you want to receive birthday reminders.
									</p>
								</div>

								<div className="grid gap-4 sm:grid-cols-2">
									{daysOptions.map((option) => (
										<div key={option.value} className="flex items-center space-x-2">
											<Checkbox
												id={`remind-${option.value}`}
												checked={(settings?.remindDaysBefore || []).includes(option.value)}
												onCheckedChange={(checked) =>
													handleDaysBeforeChange(option.value, checked as boolean)
												}
											/>
											<Label
												htmlFor={`remind-${option.value}`}
												className="font-normal cursor-pointer text-sm"
											>
												{option.label}
											</Label>
										</div>
									))}
								</div>
							</div>

							<div className="space-y-3 py-4">
								<div className="mb-3 flex flex-col gap-1.5">
									<h3 className="text-sm font-semibold">System Notifications</h3>
									<p className="text-muted-foreground text-sm">
										Receive native desktop and mobile push notifications when {APP_INFO.name} is
										open.
									</p>
								</div>

								{permission === "default" && (
									<Button
										variant="outline"
										size="sm"
										onClick={handleRequestPermission}
										className="w-fit"
									>
										Enable System Notifications
									</Button>
								)}

								{permission === "granted" && (
									<div className="flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-600">
										<BellRingIcon className="h-4 w-4 shrink-0" />
										<p>System notifications are enabled.</p>
									</div>
								)}

								{permission === "denied" && (
									<div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
										<AlertCircleIcon className="h-4 w-4 shrink-0" />
										<p>
											System notifications are blocked. Please enable them in your browser settings.
										</p>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="bg-muted/50 flex items-start gap-3 rounded-lg p-4 text-sm text-muted-foreground">
				<div className="mt-0.5 shrink-0">
					<BellIcon size={20} />
				</div>
				<p>
					Because {APP_INFO.name} is a local-first application, background push notifications while
					the app is completely closed are not supported. Reminders will appear as soon as you open
					the application.
				</p>
			</div>
		</div>
	);
}
