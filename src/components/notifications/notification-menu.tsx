import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserAvatar } from "@/components/user-avatar";
import { db } from "@/lib/db";
import { formatDistanceToNow } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { BellIcon, BroomSparklesIcon, ListChecksIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function NotificationMenu() {
	const navigate = useNavigate();

	const notifications = useLiveQuery(async () => {
		const all = await db.notifications.orderBy("createdAt").reverse().toArray();
		return all.filter((n) => !n.cleared);
	});

	const birthdays = useLiveQuery(() => db.birthdays.toArray());

	const unreadCount = notifications?.filter((n) => !n.read).length || 0;

	const [isOpen, setIsOpen] = useState(false);

	const handleNotificationClick = async (id: string, personId: string) => {
		await db.notifications.update(id, { read: true });
		setIsOpen(false);
		navigate(`/person/${personId}`);
	};

	const markAllAsRead = async () => {
		const unreadIds = notifications?.filter((n) => !n.read).map((n) => n.id) || [];
		if (unreadIds.length > 0) {
			await Promise.all(unreadIds.map((id) => db.notifications.update(id, { read: true })));
		}
	};

	const clearAllNotifications = async () => {
		const allIds = notifications?.map((n) => n.id) || [];
		if (allIds.length > 0) {
			await Promise.all(allIds.map((id) => db.notifications.update(id, { cleared: true })));
		}
	};

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative" title="Notifications">
					<BellIcon aria-hidden="true" />
					{unreadCount > 0 && (
						<Badge
							variant="destructive"
							className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
						>
							{unreadCount > 99 ? "99+" : unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="center">
				<div className="flex items-center justify-between px-4 py-3 border-b">
					<h3 className="font-semibold text-sm">Notifications</h3>
					<div className="flex items-center gap-1">
						{unreadCount > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={markAllAsRead}
								className="h-auto p-1.5 text-xs text-muted-foreground hover:text-foreground"
								title="Mark all as read"
							>
								<ListChecksIcon className="h-3.5 w-3.5" />
							</Button>
						)}
						{notifications && notifications.length > 0 && (
							<Button
								variant="ghost"
								size="sm"
								onClick={clearAllNotifications}
								className="h-auto p-1.5 text-xs text-muted-foreground hover:text-destructive"
								title="Clear all"
							>
								<BroomSparklesIcon className="h-3.5 w-3.5" />
							</Button>
						)}
					</div>
				</div>
				<div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
					{!notifications || notifications.length === 0 ? (
						<div className="p-4 text-center text-sm text-muted-foreground">
							No new notifications
						</div>
					) : (
						<div className="flex flex-col divide-y">
							{notifications.map((n) => {
								const person = birthdays?.find((b) => b.id === n.personId);

								return (
									<button
										key={n.id}
										onClick={() => handleNotificationClick(n.id, n.personId)}
										className={`flex items-start gap-2.5 p-3 text-left hover:bg-muted/50 transition-colors ${
											!n.read ? "bg-primary/5" : ""
										}`}
									>
										{person && (
											<div className="mt-0.5 shrink-0">
												<UserAvatar birthday={person} size={28} />
											</div>
										)}
										<div className="flex flex-col min-w-0 flex-1 gap-0.5">
											<div className="flex items-start justify-between gap-2">
												<p className={`text-[13px] leading-tight ${!n.read ? "font-medium" : ""}`}>
													{n.message}
												</p>
												{!n.read && (
													<span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
												)}
											</div>
											<span className="text-[11px] text-muted-foreground">
												{formatDistanceToNow(n.createdAt, { addSuffix: true })}
											</span>
										</div>
									</button>
								);
							})}
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
