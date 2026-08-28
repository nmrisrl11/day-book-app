import { InfoTooltip } from "@/components/info-tooltip";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	parseImportedBirthdays,
	parseImportedInvitations,
	parseImportedSettings,
} from "@/helpers/import-export";
import { useP2PSync } from "@/hooks/use-p2p-sync";
import { BirthdayRepository } from "@/lib/birthday-repository";
import { db } from "@/lib/db";
import { InvitationRepository } from "@/lib/invitation-repository";
import { useDayBookStore } from "@/store/day-book-store";
import { gooeyToast } from "goey-toast";
import { DownloadCloudIcon, Loader2, SendIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function P2PSyncSection() {
	const navigate = useNavigate();
	const { syncState, peerId, startHosting, connectToHost, cancelSync } = useP2PSync();

	const [isHostModalOpen, setIsHostModalOpen] = useState(false);
	const [isClientModalOpen, setIsClientModalOpen] = useState(false);
	const [connectCode, setConnectCode] = useState("");

	const handleHostSync = () => {
		setIsHostModalOpen(true);
		startHosting(
			async (send) => {
				try {
					const birthdays = await BirthdayRepository.getAll();
					const invitations = await InvitationRepository.getAll();
					const settings = useDayBookStore.getState().settings;
					const payload = { birthdays, invitations, settings };
					const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
					send(blob);
				} catch (err) {
					console.error("Failed to package data", err);
					gooeyToast.error("Sync Failed", {
						description: "Failed to package data for sync.",
						showTimestamp: false,
						classNames: { content: "items-center text-center", title: "text-center w-full" },
					});
				}
			},
			() => {
				gooeyToast.success("Transfer Complete", {
					description: "Data transferred successfully!",
					showTimestamp: false,
					classNames: { content: "items-center text-center", title: "text-center w-full" },
				});
				setIsHostModalOpen(false);
			},
		);
	};

	const handleReceiveSync = () => {
		setIsClientModalOpen(true);
		setConnectCode("");
	};

	const handleConnect = () => {
		if (connectCode.trim().length !== 6) {
			gooeyToast.error("Invalid Code", {
				description: "Please enter a valid 6-character code.",
				showTimestamp: false,
				classNames: { content: "items-center text-center", title: "text-center w-full" },
			});
			return;
		}

		connectToHost(connectCode, async (data, ack) => {
			try {
				let text = "";
				if (data instanceof Blob) {
					text = await data.text();
				} else if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
					text = new TextDecoder().decode(data);
				} else if (typeof data === "string") {
					text = data;
				} else if (typeof data === "object") {
					text = JSON.stringify(data);
				}

				if (!text) throw new Error("Empty data received");

				const payload = JSON.parse(text);

				// Validate via our existing strict schemas
				const parsedBirthdays = parseImportedBirthdays(JSON.stringify(payload.birthdays));
				const parsedSettings = parseImportedSettings(JSON.stringify(payload.settings));
				const parsedInvitations = parseImportedInvitations(JSON.stringify(payload.invitations));

				// Upsert Birthdays and Invitations
				await db.transaction("rw", db.birthdays, db.invitations, async () => {
					for (const b of parsedBirthdays) {
						const [, monthStr, dayStr] = b.birthday.split("-");
						await db.birthdays.put({
							...b,
							month: parseInt(monthStr, 10),
							day: parseInt(dayStr, 10),
						});
					}
					for (const inv of parsedInvitations) {
						await db.invitations.put(inv);
					}
				});

				try {
					await BirthdayRepository.updateHasDataHint();
				} catch (err) {
					console.error("Failed to update data hint after sync", err);
				}

				// Overwrite Settings
				useDayBookStore.getState().updateSettings(parsedSettings);

				ack();
				gooeyToast.success("Sync Complete!", {
					description: "Data merged successfully.",
					showTimestamp: false,
					classNames: { content: "items-center text-center", title: "text-center w-full" },
				});
				setIsClientModalOpen(false);
				navigate("/manage");
			} catch (err) {
				console.error("Data processing failed", err);
				gooeyToast.error("Sync Failed", {
					description: "Data was corrupted or invalid.",
					showTimestamp: false,
					classNames: { content: "items-center text-center", title: "text-center w-full" },
				});
				cancelSync();
			}
		});
	};

	const handleCloseHost = () => {
		cancelSync();
		setIsHostModalOpen(false);
	};

	const handleCloseClient = () => {
		cancelSync();
		setIsClientModalOpen(false);
	};

	return (
		<>
			<div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1 pr-4">
					<div className="flex items-center gap-2">
						<h4 className="text-sm font-semibold">Device Sync (P2P)</h4>
						<span className="inline-flex items-center rounded-md border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-600 transition-colors">
							Recommended
						</span>
						<InfoTooltip
							ariaLabel="More information about P2P Sync"
							content={
								<span>
									Securely transfer your entire database directly between devices using WebRTC.
									(Note: This relies on the third-party PeerJS Cloud for connection signaling and
									may use public TURN servers for network traversal).
								</span>
							}
						/>
					</div>
					<p className="text-muted-foreground text-sm">
						Transfer data instantly over local network
					</p>
				</div>
				<div className="mt-2 grid w-full grid-cols-2 gap-2 sm:mt-0 sm:flex sm:w-auto sm:items-center">
					<Button
						variant="outline"
						size="sm"
						onClick={handleHostSync}
						className="w-full gap-2 sm:w-auto"
					>
						<SendIcon className="h-3.5 w-3.5" />
						Send
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={handleReceiveSync}
						className="w-full gap-2 sm:w-auto"
					>
						<DownloadCloudIcon className="h-3.5 w-3.5" />
						Receive
					</Button>
				</div>
			</div>

			{/* HOST MODAL */}
			<Dialog open={isHostModalOpen} onOpenChange={handleCloseHost}>
				<DialogContent className="border-border/50 bg-background max-h-[90vh] rounded-2xl shadow-2xl sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-center font-sans text-2xl font-bold tracking-wide">
							Send Data
						</DialogTitle>
						<DialogDescription className="text-muted-foreground text-center">
							Enter this code on your other device to connect and receive your data.
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col items-center justify-center gap-6 py-6">
						{syncState === "hosting" ? (
							<>
								<div className="bg-muted flex h-24 w-full items-center justify-center rounded-xl font-mono text-4xl tracking-[0.25em]">
									{peerId || <Loader2 className="text-muted-foreground animate-spin" />}
								</div>
								<div className="text-muted-foreground flex items-center gap-2 text-sm">
									<Loader2 className="h-4 w-4 animate-spin" />
									Waiting for connection...
								</div>
							</>
						) : syncState === "connecting" || syncState === "transferring" ? (
							<>
								<div className="bg-primary/10 text-primary flex h-24 w-full items-center justify-center rounded-xl">
									<Loader2 className="h-10 w-10 animate-spin" />
								</div>
								<div className="text-primary text-sm font-medium">Transferring data...</div>
							</>
						) : (
							<div className="text-destructive text-sm">Connection ended or failed.</div>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* CLIENT MODAL */}
			<Dialog open={isClientModalOpen} onOpenChange={handleCloseClient}>
				<DialogContent className="border-border/50 bg-background max-h-[90vh] rounded-2xl shadow-2xl sm:max-w-md">
					<DialogHeader>
						<DialogTitle className="text-center font-sans text-2xl font-bold tracking-wide">
							Receive Data
						</DialogTitle>
						<DialogDescription className="text-muted-foreground text-center">
							Enter the 6-character code from your other device to securely merge data.
						</DialogDescription>
					</DialogHeader>

					<div className="flex flex-col items-center justify-center gap-6 py-6">
						{syncState === "idle" || syncState === "error" ? (
							<>
								<Input
									placeholder="e.g. A1B2C3"
									value={connectCode}
									onChange={(e) => setConnectCode(e.target.value.toUpperCase())}
									className="h-14 text-center font-mono text-2xl tracking-[0.2em] uppercase"
									maxLength={6}
									id="receive-code"
									autoComplete="off"
								/>
								<Button
									className="h-12 w-full"
									onClick={handleConnect}
									disabled={connectCode.length !== 6}
								>
									Connect & Sync
								</Button>
							</>
						) : syncState === "connecting" || syncState === "transferring" ? (
							<>
								<div className="bg-primary/10 text-primary flex h-24 w-full items-center justify-center rounded-xl">
									<Loader2 className="h-10 w-10 animate-spin" />
								</div>
								<div className="text-primary text-sm font-medium">
									Connecting & Receiving data...
								</div>
							</>
						) : null}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
