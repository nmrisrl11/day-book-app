import { FULL_MONTHS, MONTHS } from "@/constants/months";
import type { Birthday } from "@/types/birthday";
import { useState } from "react";
import { MonthCard } from "./month-card";
import { MonthlyBirthdayModal } from "./monthly-birthday-modal";

interface BirthdaysSectionProps {
	birthdaysByMonth: Record<number, Birthday[]>;
}

export function BirthdaysSection({ birthdaysByMonth }: BirthdaysSectionProps) {
	const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);

	const handleClose = () => setSelectedMonthIndex(null);

	return (
		<div className="flex w-full flex-col gap-6">
			<h2 className="text-foreground px-2 text-xl font-bold tracking-tight uppercase md:text-2xl">
				Birthdays
			</h2>

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

			<MonthlyBirthdayModal
				monthName={selectedMonthIndex !== null ? FULL_MONTHS[selectedMonthIndex] : ""}
				birthdays={selectedMonthIndex !== null ? birthdaysByMonth[selectedMonthIndex] || [] : []}
				isOpen={selectedMonthIndex !== null}
				onClose={handleClose}
			/>
		</div>
	);
}
