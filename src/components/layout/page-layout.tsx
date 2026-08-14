import React from "react";

interface PageLayoutProps {
	children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
	return (
		<div className="relative min-h-screen overflow-x-hidden bg-background font-sans text-foreground">
			<main className="relative z-10 mx-auto flex max-w-4xl flex-col gap-12 px-4 py-8 md:gap-16 md:py-12">
				{children}
			</main>
		</div>
	);
}
