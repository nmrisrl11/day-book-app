self.addEventListener("notificationclick", function (event) {
	event.notification.close();

	// Attempt to extract the URL from the notification data, fallback to root
	const urlToOpen = event.notification.data?.url || self.location.origin;

	event.waitUntil(
		clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
			let matchingClient = null;

			// If the app is already open, find it
			for (let i = 0; i < windowClients.length; i++) {
				const client = windowClients[i];
				if (client.url.includes(self.location.origin) && "focus" in client) {
					matchingClient = client;
					break;
				}
			}

			if (matchingClient) {
				// Focus the existing window and navigate to the target URL
				return matchingClient.focus().then((client) => {
					// client might be undefined in some browsers after focus()
					const activeClient = client || matchingClient;
					if ("navigate" in activeClient && activeClient.url !== urlToOpen) {
						return activeClient.navigate(urlToOpen);
					}
				});
			}

			// If the app is closed, open a new window
			if (clients.openWindow) {
				return clients.openWindow(urlToOpen);
			}
		}),
	);
});
