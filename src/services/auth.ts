import { Log } from "../logging_middleware/logger";

export interface AuthPayload {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}

export const authenticateService = async (payload: AuthPayload) => {
  Log(
    "frontend",
    "info",
    "auth",
    `Initiating authentication request for email: ${payload.email}`
  );

  try {
    const res = await fetch("http://20.207.122.201/evaluation-service/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      Log(
        "frontend",
        "error",
        "auth",
        `Authentication failed with status: ${res.status} ${res.statusText}`
      );
      throw new Error(`Authentication failed: ${res.status}`);
    }

    const data = await res.json();
    Log(
      "frontend",
      "info",
      "auth",
      "Authentication request successful"
    );
    return data;
  } catch (error) {
    Log(
      "frontend",
      "error",
      "auth",
      `Exception during authentication: ${error || "Error on Login"}`
    );
    throw error;
  }
};
