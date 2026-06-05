import { useState, useEffect } from "react";
import apiCall from "../services/apiCall";

export type UsernameStatus = | "idle" | "available" | "taken" | "invalid" | "checking";

type UseUsernameAvailabilityOptions = {
    username: string;
    currentUsername?: string;
    minLength?: number;
    delay?: number;

};

const useUsernameAvailability = ({username, currentUsername, minLength = 5, delay = 400}: UseUsernameAvailabilityOptions) : {usernameStatus: UsernameStatus, isUsernameValid: boolean} => {
    const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");

    useEffect(() => {
		const cleanUsername = username.trim();

		if (!cleanUsername || cleanUsername === currentUsername) {
			setUsernameStatus("idle");
			return;
		}

		const timeout = setTimeout(async () => {
			if (cleanUsername.length < minLength) {
				setUsernameStatus("invalid");
				return;
			}

			setUsernameStatus("checking");

			try {
				const response = await apiCall<{ success: boolean; available: boolean; }>("users/check-username", { method: "POST", body: { username: cleanUsername } });
				if (!response?.success) {
					setUsernameStatus("idle");
					return;
				}
				setUsernameStatus(response.available ? "available" : "taken");
			} catch {
				setUsernameStatus("idle");
			}
		}, delay);
		return () => clearTimeout(timeout);
	}, [username, currentUsername, minLength, delay]);
	return {
		usernameStatus,
		isUsernameValid:
			usernameStatus === "available" ||
			username.trim() === currentUsername,
	};
};

export default useUsernameAvailability;