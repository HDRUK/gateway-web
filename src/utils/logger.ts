enum LogLevel {
  Info = "info",
  Warn = "warn",
  Error = "error",
}

class Log {
  readonly logger: Console;

  constructor() {
    this.logger = console;
  }

  private static formatMessage = (data: string | object) =>
    typeof data === "object" ? JSON.stringify(data, null, 2) : data;

  private static log = (
    level: LogLevel,
    message: string | object,
    session: string,
    location: string
  ) => {
    const logObject = {
      timestamp: new Date().toISOString(),
      level,
      "x-request-session-id": session,
      location,
      message: Log.formatMessage(message),
    };

    const logLine = JSON.stringify(logObject);

    const consoleMethod = {
      [LogLevel.Info]: console.log,
      [LogLevel.Warn]: console.warn,
      [LogLevel.Error]: console.error,
    }[level];

    consoleMethod(logLine);
  };

  public info = (message: string | object, session: string, location: string) =>
    Log.log(LogLevel.Info, message, session, location);

  public warn = (message: string | object, session: string, location: string) =>
    Log.log(LogLevel.Warn, message, session, location);

  public error = (message: string | object, session: string, location: string) =>
    Log.log(LogLevel.Error, message, session, location);
}

export const logger = new Log();
