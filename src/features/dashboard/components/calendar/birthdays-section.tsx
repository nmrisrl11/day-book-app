import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FULL_MONTHS, MONTHS } from "@/constants/months";
import type { Birthday } from "@/types/birthday";
import { CalendarIcon, ListIcon } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { MonthCard } from "./month-card";

const MonthlyBirthdayModal = lazy(() =>
	import("./monthly-birthday-modal").then((m) => ({ default: m.MonthlyBirthdayModal })),
);
const BirthdayCalendar = lazy(() =>
	import("@/features/calendar/components/birthday-calendar").then((m) => ({
		default: m.BirthdayCalendar,
	})),
);

interface BirthdaysSectionProps {
	birthdaysByMonth: Record<number, Birthday[]>;
	currentDate: Date;
}

export function BirthdaysSection({ birthdaysByMonth, currentDate }: BirthdaysSectionProps) {
	const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);

	const handleClose = () => setSelectedMonthIndex(null);

	return (
		<div className="flex w-full flex-col gap-6">
			<Tabs defaultValue="list" className="w-full">
				<div className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="text-foreground text-xl font-bold tracking-tight uppercase md:text-2xl">
						Birthdays
					</h2>
					<TabsList className="grid w-full grid-cols-2 self-start sm:max-w-50 sm:self-auto">
						<TabsTrigger value="list" className="flex items-center gap-2">
							<ListIcon className="h-4 w-4" />
							List
						</TabsTrigger>
						<TabsTrigger value="calendar" className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4" />
							Calendar
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="list" className="mt-6">
					<div className="grid grid-cols-2 gap-x-4 gap-y-6 px-2 md:grid-cols-4 md:gap-y-8 lg:grid-cols-6">
						{MONTHS.map((monthName, index) => (
							<MonthCard
								key={index}
								monthName={monthName}
								monthIndex={index}
								birthdays={birthdaysByMonth[index] || []}
								onClick={setSelectedMonthIndex}
							/>
						))}
					</div>

					{selectedMonthIndex !== null && (
						<Suspense fallback={null}>
							<MonthlyBirthdayModal
								monthName={FULL_MONTHS[selectedMonthIndex]}
								birthdays={birthdaysByMonth[selectedMonthIndex] || []}
								isOpen={true}
								onClose={handleClose}
								currentDate={currentDate}
							/>
						</Suspense>
					)}
				</TabsContent>

				<TabsContent value="calendar" className="mt-6 px-2">
					<Suspense fallback={<div className="bg-muted h-100 w-full animate-pulse rounded-lg" />}>
						<BirthdayCalendar />
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
}
