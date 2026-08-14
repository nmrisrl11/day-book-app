import { BirthdaysSection } from "./components/birthdays-by-month/birthdays-section";
import { HappyBirthdaySection } from "./components/happy-birthday/happy-birthday-section";
import { Footer } from "./components/layout/footer";
import { PageLayout } from "./components/layout/page-layout";
import { UpcomingBirthdaysSection } from "./components/upcoming-birthdays/upcoming-birthdays-section";
import { useBirthdayData } from "./hooks/use-birthday-data";
import { DayBookProvider, useDayBook } from "./context/day-book-context";
import { BirthdayManagementScreen } from "./components/management/birthday-management-screen";
import { useState } from "react";
import { EmptyState } from "./components/empty-state";

function Dashboard() {
	const { todayCelebrants, upcomingBirthdays, birthdaysByMonth, currentDate } = useBirthdayData();
	const { birthdays } = useDayBook();

	if (birthdays.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="flex w-full flex-col items-center gap-16">
			<HappyBirthdaySection celebrants={todayCelebrants} currentDate={currentDate} />
			<UpcomingBirthdaysSection upcomingBirthdays={upcomingBirthdays} currentDate={currentDate} />
			<BirthdaysSection birthdaysByMonth={birthdaysByMonth} />
		</div>
	);
}

function MainApp() {
	const [currentView, setCurrentView] = useState<"dashboard" | "management">("dashboard");

	return (
		<PageLayout currentView={currentView} setCurrentView={setCurrentView}>
			{currentView === "dashboard" ? <Dashboard /> : <BirthdayManagementScreen />}
			<Footer />
		</PageLayout>
	);
}

function App() {
	return (
		<DayBookProvider>
			<MainApp />
		</DayBookProvider>
	);
}

export default App;
