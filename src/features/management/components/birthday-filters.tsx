import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FULL_MONTHS } from "@/constants/months";
import { RELATIONSHIP_OPTIONS } from "@/types/birthday";
import { FilterXIcon, SearchIcon } from "lucide-react";
import { MONTH_OPTIONS, SORT_OPTIONS } from "../hooks/use-birthday-management";

export interface BirthdayFiltersProps {
	localSearch: string;
	setLocalSearch: (val: string) => void;
	monthFilter: string;
	setMonthFilter: (val: (typeof MONTH_OPTIONS)[number]) => void;
	relationshipFilter: string;
	setRelationshipFilter: (val: string) => void;
	sortOption: string;
	setSortOption: (val: (typeof SORT_OPTIONS)[number]) => void;
	isFiltersActive: boolean;
	handleClearFilters: () => void;
}

export function BirthdayFilters({
	localSearch,
	setLocalSearch,
	monthFilter,
	setMonthFilter,
	relationshipFilter,
	setRelationshipFilter,
	sortOption,
	setSortOption,
	isFiltersActive,
	handleClearFilters,
}: BirthdayFiltersProps) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
			<div className="relative flex-1">
				<SearchIcon
					className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
					aria-hidden="true"
				/>
				<Input
					id="search-birthdays"
					name="search-birthdays"
					placeholder="Search by name..."
					className="bg-background pl-9"
					value={localSearch}
					onChange={(e) => setLocalSearch(e.target.value)}
					aria-label="Search by name"
					autoComplete="off"
				/>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Select
					value={monthFilter}
					onValueChange={(val) => setMonthFilter(val as (typeof MONTH_OPTIONS)[number])}
				>
					<SelectTrigger className="bg-background w-32.5" aria-label="Filter by month">
						<SelectValue placeholder="Month" />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectItem value="all">All Months</SelectItem>
						{FULL_MONTHS.map((month, index) => (
							<SelectItem key={month} value={(index + 1).toString()}>
								{month}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={relationshipFilter} onValueChange={(val) => setRelationshipFilter(val)}>
					<SelectTrigger className="bg-background w-32.5" aria-label="Filter by relationship">
						<SelectValue placeholder="Relationship" />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectItem value="all">All People</SelectItem>
						{RELATIONSHIP_OPTIONS.map((option) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select
					value={sortOption}
					onValueChange={(val) => setSortOption(val as (typeof SORT_OPTIONS)[number])}
				>
					<SelectTrigger className="bg-background w-40" aria-label="Sort birthdays">
						<SelectValue placeholder="Sort by" />
					</SelectTrigger>
					<SelectContent position="popper">
						<SelectItem value="upcoming">Upcoming First</SelectItem>
						<SelectItem value="name-asc">Name (A-Z)</SelectItem>
						<SelectItem value="name-desc">Name (Z-A)</SelectItem>
						<SelectItem value="date-asc">Oldest to Youngest</SelectItem>
						<SelectItem value="date-desc">Youngest to Oldest</SelectItem>
					</SelectContent>
				</Select>

				{isFiltersActive && (
					<Button
						variant="ghost"
						size="icon"
						className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
						onClick={handleClearFilters}
						aria-label="Clear all filters"
						title="Clear all filters"
					>
						<FilterXIcon className="h-4 w-4" aria-hidden="true" />
					</Button>
				)}
			</div>
		</div>
	);
}
