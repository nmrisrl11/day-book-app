import { cn } from "@/lib/utils";

export const PartyHat = ({ className }: { className?: string }) => (
	<svg 
		viewBox="0 0 64 64" 
		className={cn(className)} 
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M32 8L16 56H48L32 8Z" fill="#ec4899" />
		<path d="M24 32Q32 40 40 32" stroke="#fcd34d" strokeWidth="4" fill="none" />
		<path d="M20 44Q32 52 44 44" stroke="#fcd34d" strokeWidth="4" fill="none" />
		<circle cx="32" cy="8" r="6" fill="#fcd34d" />
		<path d="M16 56C16 56 32 60 48 56" stroke="#ec4899" strokeWidth="4" fill="none" />
	</svg>
);
