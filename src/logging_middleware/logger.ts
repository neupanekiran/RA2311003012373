export type LogStack = "frontend" | "backend";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export const Log = async (stack: LogStack, level: LogLevel, packageName: string, message: string) => {
  const logData = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: packageName.toLowerCase(),
    message,
    timestamp: new Date().toISOString(),
  };

  // Local console log for development debugging
  console.log(`[${logData.level}] [${logData.package}] ${logData.message} (Stack: ${logData.stack})`);

  try {
    
    await fetch("http://20.207.122.201/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logData),
    });
  } catch (error) {
    console.error("Failed to send log to Test Server:", error);
  }
};
