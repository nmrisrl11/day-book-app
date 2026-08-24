import { gooeyToast } from "goey-toast";
import Peer, { type DataConnection } from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";
export type SyncState = "idle" | "hosting" | "connecting" | "transferring" | "success" | "error";

export function useP2PSync() {
	const [syncState, setSyncState] = useState<SyncState>("idle");
	const syncStateRef = useRef<SyncState>("idle");
	const [peerId, setPeerId] = useState<string>("");
	const peerRef = useRef<Peer | null>(null);
	const connRef = useRef<DataConnection | null>(null);

	const updateSyncState = useCallback((state: SyncState) => {
		syncStateRef.current = state;
		setSyncState(state);
	}, []);

	const cleanup = useCallback(() => {
		if (connRef.current) {
			connRef.current.close();
			connRef.current = null;
		}
		if (peerRef.current) {
			peerRef.current.destroy();
			peerRef.current = null;
		}
		updateSyncState("idle");
		setPeerId("");
	}, [updateSyncState]);

	// Unmount cleanup
	useEffect(() => {
		return cleanup;
	}, [cleanup]);

	// Initialize as Host (Sender)
	const startHosting = useCallback(
		(onReadyToSend: (send: (data: Blob) => void) => void, onAck: () => void) => {
			cleanup();
			updateSyncState("hosting");

			// Generate a random 6-character code
			const code = Math.random().toString(36).substring(2, 8).toUpperCase();
			const fullId = `DAYBOOK-${code}`;

			try {
				const peer = new Peer(fullId);
				peerRef.current = peer;

				peer.on("open", () => {
					setPeerId(code);
				});

				peer.on("connection", (conn) => {
					if (connRef.current) {
						// Reject multiple connections
						conn.close();
						return;
					}
					connRef.current = conn;
					updateSyncState("connecting");

					conn.on("open", () => {
						updateSyncState("transferring");
						onReadyToSend((data: Blob) => {
							conn.send(data);
						});
					});

					conn.on("data", (data) => {
						// Expecting acknowledgment from receiver
						let isAck = false;
						if (
							typeof data === "object" &&
							data !== null &&
							(data as Record<string, unknown>).type === "ACK"
						) {
							isAck = true;
						} else if (typeof data === "string") {
							try {
								const parsed = JSON.parse(data);
								if (parsed.type === "ACK") isAck = true;
							} catch (e) {}
						} else if (data instanceof ArrayBuffer || data instanceof Uint8Array) {
							try {
								const parsed = JSON.parse(new TextDecoder().decode(data));
								if (parsed.type === "ACK") isAck = true;
							} catch (e) {}
						}

						if (isAck) {
							updateSyncState("success");
							onAck();
							setTimeout(cleanup, 3000); // Close after 3 seconds
						}
					});

					conn.on("close", () => {
						if (
							peerRef.current &&
							peerRef.current.id === fullId &&
							syncStateRef.current !== "success"
						) {
							updateSyncState("idle");
						}
					});

					conn.on("error", (err) => {
						console.error("Connection Error", err);
						if (syncStateRef.current !== "success") {
							gooeyToast.error("Connection Error", {
								description: err.message,
								showTimestamp: false,
								classNames: { content: "items-center text-center", title: "text-center w-full" },
							});
							updateSyncState("error");
							cleanup();
						}
					});
				});

				peer.on("error", (err) => {
					console.error("Peer Error", err);
					if (syncStateRef.current !== "success") {
						gooeyToast.error("Connection Failed", {
							description: "Peer connection failed. Check your network.",
							showTimestamp: false,
							classNames: { content: "items-center text-center", title: "text-center w-full" },
						});
						updateSyncState("error");
						cleanup();
					}
				});
			} catch (error) {
				console.error("Failed to initialize Peer", error);
				gooeyToast.error("Sync Failed", {
					description: "Failed to initialize sync.",
					showTimestamp: false,
					classNames: { content: "items-center text-center", title: "text-center w-full" },
				});
				updateSyncState("error");
				cleanup();
			}
		},
		[cleanup, updateSyncState],
	);

	// Initialize as Receiver
	const connectToHost = useCallback(
		(code: string, onDataReceived: (data: unknown, ack: () => void) => void) => {
			cleanup();
			updateSyncState("connecting");

			try {
				const peer = new Peer(); // Auto generated ID
				peerRef.current = peer;

				peer.on("open", () => {
					const fullId = `DAYBOOK-${code.toUpperCase().trim()}`;
					const conn = peer.connect(fullId, { reliable: true });
					connRef.current = conn;

					conn.on("open", () => {
						updateSyncState("transferring");
					});

					conn.on("data", (data) => {
						// PeerJS might receive Blobs as ArrayBuffers or Strings depending on the browser
						if (
							data instanceof Blob ||
							data instanceof ArrayBuffer ||
							data instanceof Uint8Array ||
							typeof data === "string" ||
							typeof data === "object"
						) {
							onDataReceived(data, () => {
								conn.send({ type: "ACK" });
								updateSyncState("success");
								setTimeout(cleanup, 3000);
							});
						} else {
							console.error("Unknown data type received:", data);
							gooeyToast.error("Sync Failed", {
								description: "Received unexpected data format.",
								showTimestamp: false,
								classNames: { content: "items-center text-center", title: "text-center w-full" },
							});
							updateSyncState("error");
							cleanup();
						}
					});

					conn.on("close", () => {
						// Connection closed
					});

					conn.on("error", (err) => {
						console.error("Connection Error", err);
						gooeyToast.error("Connection Error", {
							description: err.message,
							showTimestamp: false,
							classNames: { content: "items-center text-center", title: "text-center w-full" },
						});
						updateSyncState("error");
						cleanup();
					});
				});

				peer.on("error", (err) => {
					console.error("Peer Error", err);
					gooeyToast.error("Connection Failed", {
						description: "Ensure the code is correct and the host is waiting.",
						showTimestamp: false,
						classNames: { content: "items-center text-center", title: "text-center w-full" },
					});
					updateSyncState("error");
					cleanup();
				});
			} catch (error) {
				console.error("Failed to initialize Peer", error);
				gooeyToast.error("Sync Failed", {
					description: "Failed to initialize sync.",
					showTimestamp: false,
					classNames: { content: "items-center text-center", title: "text-center w-full" },
				});
				updateSyncState("error");
				cleanup();
			}
		},
		[cleanup, updateSyncState],
	);

	return {
		syncState,
		peerId,
		startHosting,
		connectToHost,
		cancelSync: cleanup,
	};
}
