export const getHasDataHint = () => {
	return localStorage.getItem("daybook_has_data") === "true";
};

export const setHasDataHint = (hasData: boolean) => {
	if (hasData) {
		localStorage.setItem("daybook_has_data", "true");
	} else {
		localStorage.removeItem("daybook_has_data");
	}
};

export const getHasInvitationsHint = () => {
	return localStorage.getItem("daybook_has_invitations") === "true";
};

export const setHasInvitationsHint = (hasData: boolean) => {
	if (hasData) {
		localStorage.setItem("daybook_has_invitations", "true");
	} else {
		localStorage.removeItem("daybook_has_invitations");
	}
};
