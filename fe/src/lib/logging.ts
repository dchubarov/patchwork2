
/** Logging level */
export type LogLevel = "log" | "warn" | "error";

/** Logging function signature */
export interface LogFn {
    (message?: any, ...optionalParams: any[]): void;
}

// const NO_OP: LogFn = (message, optionalParams) => {};

export interface Logger {
    log: LogFn;
    warn: LogFn;
    error: LogFn;
}

export interface LoggerOptions {
    level?: LogLevel
}

export class ConsoleLogger implements Logger {
    readonly log: LogFn;
    readonly warn: LogFn;
    readonly error: LogFn;

    constructor(options?: LoggerOptions) {
        this.error = console.error.bind(console);
        this.warn = console.warn.bind(console);
        this.log = console.log.bind(console);
    }
}

export const logger = new ConsoleLogger();
export const developmentLogger = new ConsoleLogger();
