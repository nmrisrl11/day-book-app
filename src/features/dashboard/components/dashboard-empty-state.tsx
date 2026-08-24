import { AnimatedLogo } from "@/components/icons/animated-logo";
import { Button } from "@/components/ui/button";
import { APP_INFO } from "@/constants/app-info";
import { PlusIcon, UploadIcon } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

const BirthdayFormModal = lazy(() =>
	import("@/features/management/components/birthday-form-modal").then((m) => ({
		default: m.BirthdayFormModal,
	})),
);

export function DashboardEmptyState({ disabled }: { disabled?: boolean }) {
	const [formModalOpen, setFormModalOpen] = useState(false);
	const navigate = useNavigate();

	const handleImportClick = () => {
		navigate("/settings?tab=data");
	};

	return (
		<div className="flex w-full flex-col items-center justify-center pt-24 pb-32">
			{/* Decorative background elements */}
			<div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] bg-size-[24px_24px]" />

			<div className="animate-float-idle mb-6 flex justify-center drop-shadow-md motion-reduce:animate-none">
				<AnimatedLogo type="icon" className="h-24 w-24" iconClassName="h-full w-full" />
			</div>

			<h1 className="mb-4 text-center text-4xl font-extrabold tracking-tight md:text-5xl">
				Welcome to {APP_INFO.name}
			</h1>

			<p className="text-muted-foreground mb-8 max-w-md text-center text-lg">
				Your personal space to track family and friends' birthdays so you never miss a special day
				again.
			</p>

			<div className="flex w-full flex-col gap-4 px-4 sm:w-auto sm:flex-row">
				<Button
					size="lg"
					className="w-full text-base sm:w-auto"
					onClick={() => setFormModalOpen(true)}
					disabled={disabled}
				>
					<PlusIcon className="mr-2 h-5 w-5" />
					Add a Person
				</Button>

				<Button
					size="lg"
					variant="outline"
					className="w-full text-base sm:w-auto"
					onClick={handleImportClick}
					disabled={disabled}
				>
					<UploadIcon className="mr-2 h-5 w-5" />
					Import or Sync
				</Button>
			</div>

			{formModalOpen && (
				<Suspense fallback={null}>
					<BirthdayFormModal open={formModalOpen} onOpenChange={setFormModalOpen} birthday={null} />
				</Suspense>
			)}
		</div>
	);
}
