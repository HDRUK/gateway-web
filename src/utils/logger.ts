class Log {
    readonly logger: Console;

    readonly extend: string | undefined;

    constructor() {
        this.logger = console;
    }

   private static formatError = (data: string | object): string => {
        if (data instanceof Error) {
            return JSON.stringify(
                {
                    name: data.name,
                    message: data.message,
                    stack: data.stack,
                },
                null,
                2
            );
        }

        return typeof data === "object"
            ? JSON.stringify(data, null, 2)
            : data.toString();
    };

    private static logFormat = (
        session: string,
        level: "INFO" | "WARN" | "ERROR",
        location: string,
        message: string | object
    ) => {
        return {
            timestamp: new Date().toISOString(),
            level,
            "x-request-session-id": session,
            location,
            message: Log.formatError(message),
        };
    };

    public info = (
        message: string | object,
        session: string,
        location: string
    ) => {
        this.logger.info(
            JSON.stringify(Log.logFormat(session, "INFO", location, message))
        );
    };

    public warn = (
        message: string | object,
        session: string,
        location: string
    ) => {
        this.logger.warn(
            JSON.stringify(Log.logFormat(session, "WARN", location, message))
        );
    };

    public error = (
        message: string | object,
        session: string,
        location: string
    ) => {
        this.logger.error(
            JSON.stringify(Log.logFormat(session, "ERROR", location, message))
        );
    };
}

export const logger = new Log();
