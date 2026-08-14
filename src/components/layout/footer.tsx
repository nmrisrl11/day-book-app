export function Footer() {
	return (
		<footer className="mt-8 flex w-full items-center justify-between pb-4 text-sm text-muted-foreground">
			<div className="flex flex-col gap-1">
				<span>
					Developed by:{" "}
					<a
						href="https://www.nmrisrl.dev/"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium transition-colors hover:text-slate-800 dark:hover:text-slate-200"
					>
						Nomer with ☕
					</a>
				</span>
				<a
					href="https://github.com/nmrisrl11/day-book-app"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 transition-colors hover:text-slate-800 dark:hover:text-slate-200"
				>
					{/* <Github className="w-4 h-4" /> */}
					<span>Repository Link Here</span>
				</a>
			</div>
		</footer>
	);
}
