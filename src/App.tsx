import { BirthdaysSection } from "./components/birthdays-by-month/birthdays-section";
import { HappyBirthdaySection } from "./components/happy-birthday/happy-birthday-section";
import { Footer } from "./components/layout/footer";
import { PageLayout } from "./components/layout/page-layout";
import { UpcomingBirthdaysSection } from "./components/upcoming-birthdays/upcoming-birthdays-section";
import { useBirthdayData } from "./hooks/use-birthday-data";
import { DayBookProvider, useDayBook } from "./context/day-book-context";
import { BirthdayManagementScreen } from "./components/management/birthday-management-screen";
import { SettingsScreen } from "./components/settings/settings-screen";
import { EmptyState } from "./components/empty-state";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
	return (
		<BrowserRouter>
			<PageLayout>
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/manage" element={<BirthdayManagementScreen />} />
					<Route path="/settings" element={<SettingsScreen />} />
				</Routes>
				<Footer />
			</PageLayout>
		</BrowserRouter>
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
