class Log {
    readonly logger: Console;

    readonly extend: string | undefined;

    constructor() {
        this.logger = console;
    }

    private static format = (data: string | object) =>
        typeof data === "object" ? JSON.stringify(data, null, 2) : data;

    public info = (
        message: string | object,
        session: string,
        location: string
    ) => {
        this.logger.info(
            `session: ${session} - info - during  ${location}  -`,
            Log.format(message)
        );
    };

    public warn = (
        message: string | object,
        session: string,
        location: string
    ) => {
        this.logger.warn(
            `session: ${session} - warn - during ${location}  - `,
            Log.format(message)
        );
    };

    public error = (
        message: string | object,
        session: string,
        location: string
    ) => {
        this.logger.error(
            `session: ${session} - error - during  ${location} - `,
            Log.format(message)
        );
    };
}

export const logger = new Log();
