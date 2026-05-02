import { Log } from "../logging_midd/logger";

export interface RegisterPayload {
  email: string;
  name: string;
  mobileNo: string;
  rollNo: string;
  accessCode: string;
  githubUsername: string;
}

export const registerService = async (payload: RegisterPayload) => {
  Log(
    "frontend",
    "info",
    "register",
    `Initiating registration request for email: ${payload.email}`
  );

  try {
    const res = await fetch("http://20.207.122.201/evaluation-service/register", {
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
        "register",
        `Registration failed with status: ${res.status} ${res.statusText}`
      );
      throw new Error(`Registration failed: ${res.status}`);
    }

    const data = await res.json();
    Log(
      "frontend",
      "info",
      "register",
      "Registration request successful"
    );
    return data;
  } catch (error) {
    Log(
      "frontend",
      "error",
      "register",
      `Exception during registration: ${error  || " Error on Registration"}`
    );
    throw error;
  }
};
