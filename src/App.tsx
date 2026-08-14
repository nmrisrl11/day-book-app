import { BirthdaysSection } from "./components/birthdays-by-month/birthdays-section";
import { HappyBirthdaySection } from "./components/happy-birthday/happy-birthday-section";
import { Footer } from "./components/layout/footer";
import { PageLayout } from "./components/layout/page-layout";
import { UpcomingBirthdaysSection } from "./components/upcoming-birthdays/upcoming-birthdays-section";
import { BIRTHDAYS } from "./constants/birthdays";
import { useBirthdayData } from "./hooks/use-birthday-data";

function App() {
	const { todayCelebrants, upcomingBirthdays, birthdaysByMonth, currentDate } =
		useBirthdayData(BIRTHDAYS);

	return (
		<PageLayout>
			<div className="flex w-full flex-col items-center gap-16">
				<HappyBirthdaySection celebrants={todayCelebrants} currentDate={currentDate} />
				<UpcomingBirthdaysSection upcomingBirthdays={upcomingBirthdays} currentDate={currentDate} />
				<BirthdaysSection birthdaysByMonth={birthdaysByMonth} />
			</div>
			<Footer />
		</PageLayout>
	);
}

export default App;
