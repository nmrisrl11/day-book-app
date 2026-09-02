import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FULL_MONTHS } from "@/constants/months";
import { cn } from "@/lib/utils";
import { CalendarController } from "@fullcalendar/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export interface EventCalendarToolbarProps {
	className?: string;
	controller: CalendarController;
	availableViews: string[];
	currentViewDate: Date;
	addButton?: {
		isPrimary?: boolean;
		text?: string;
		hint?: string;
		click?: (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	};
}

export function EventCalendarToolbar({
	className,
	controller,
	availableViews,
	currentViewDate,
	addButton,
}: EventCalendarToolbarProps) {
	const buttons = controller.getButtonState();

	const currentMonth = currentViewDate ? currentViewDate.getMonth() : new Date().getMonth();
	const currentYear = currentViewDate ? currentViewDate.getFullYear() : new Date().getFullYear();

	const handleMonthChange = (val: string) => {
		const newMonth = Number.parseInt(val, 10);
		controller.gotoDate(new Date(currentYear, newMonth, 1));
	};

	const handleYearChange = (val: string) => {
		const newYear = Number.parseInt(val, 10);
		controller.gotoDate(new Date(newYear, currentMonth, 1));
	};

	// Standard years 1900 - 2100 (reversed so newest is on top if you want, but usually ascending is fine. Let's do descending so 2026 is closer to the top)
	const years = Array.from({ length: 201 }, (_, i) => 2100 - i);

	return (
		<div
			className={cn(
				"flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
		>
			<div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-4">
				<div className="flex items-center gap-2">
					{addButton && (
						<Button onClick={addButton.click} aria-label={addButton.hint} size="sm">
							{addButton.text}
						</Button>
					)}
					<Button
						onClick={() => controller.today()}
						aria-label={buttons.today?.hint || "Today"}
						variant="outline"
						size="sm"
					>
						{buttons.today?.text || "Today"}
					</Button>
					<div className="flex items-center">
						<Button
							onClick={() => controller.prev()}
							disabled={buttons.prev.isDisabled}
							aria-label={buttons.prev.hint}
							variant="ghost"
							size="icon"
							className="h-8 w-8"
						>
							<ChevronLeftIcon className="h-4 w-4" />
						</Button>
						<Button
							onClick={() => controller.next()}
							disabled={buttons.next.isDisabled}
							aria-label={buttons.next.hint}
							variant="ghost"
							size="icon"
							className="h-8 w-8"
						>
							<ChevronRightIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<div className="flex flex-1 items-center justify-end gap-2 sm:flex-initial">
					<Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
						<SelectTrigger className="h-9 w-30 font-semibold">
							<SelectValue placeholder="Month" />
						</SelectTrigger>
						<SelectContent position="popper" className="max-h-75">
							<SelectGroup>
								{FULL_MONTHS.map((m, i) => (
									<SelectItem key={m} value={i.toString()}>
										{m}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
					<Select value={currentYear.toString()} onValueChange={handleYearChange}>
						<SelectTrigger className="h-9 w-22 font-semibold">
							<SelectValue placeholder="Year" />
						</SelectTrigger>
						<SelectContent position="popper" className="max-h-75">
							<SelectGroup>
								{years.map((y) => (
									<SelectItem key={y} value={y.toString()}>
										{y}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>
			{availableViews.length > 1 && (
				<Tabs value={controller.view?.type ?? availableViews[0]} className="w-full sm:w-auto">
					<TabsList className="w-full">
						{availableViews.map((availableView) => (
							<TabsTrigger
								key={availableView}
								value={availableView}
								onClick={() => controller.changeView(availableView)}
								aria-label={buttons[availableView]?.hint}
								className="w-full"
							>
								{buttons[availableView]?.text}
							</TabsTrigger>
						))}
					</TabsList>
				</Tabs>
			)}
		</div>
	);
}
