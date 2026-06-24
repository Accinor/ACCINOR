type Level = "INFO" | "WARN" | "ERROR"

function log(level: Level, message: string, meta?: Record<string, unknown>) {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level}] [ACCINOR]`

  if (level === "ERROR") {
    console.error(prefix, message, meta ?? "")
  } else if (level === "WARN") {
    console.warn(prefix, message, meta ?? "")
  } else {
    console.log(prefix, message, meta ?? "")
  }
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log("INFO", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log("WARN", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log("ERROR", msg, meta),
}
