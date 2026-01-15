export class DebugError extends Error {
    constructor(message: string = 'This is a debug error for testing purposes') {
        super(message);
        this.name = 'DebugError';
    }
}

export class StackTraceError extends Error {
    constructor(message: string = 'An error occurred with stack trace') {
        super(message);
        this.name = 'StackTraceError';
    }
}