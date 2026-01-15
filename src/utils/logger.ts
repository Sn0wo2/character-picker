const isDev = import.meta.env?.MODE === 'development' || process.env.NODE_ENV === 'development';
const isNode = typeof process !== 'undefined' && process.versions?.node;

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

class AsyncLogger {
    private readonly level: LogLevel;
    private readonly levels: LogLevel[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
    private queue: string[] = [];
    private flushing = false;
    private readonly stdoutFd = 1;
    private fsModule: typeof import('node:fs') | null = null;

    constructor() {
        this.level = isDev ? 'debug' : 'info';
    }

    trace(message: string | object, ...args: unknown[]) {
        this.pushToQueue('trace', message, ...args);
    }

    debug(message: string | object, ...args: unknown[]) {
        this.pushToQueue('debug', message, ...args);
    }

    info(message: string | object, ...args: unknown[]) {
        this.pushToQueue('info', message, ...args);
    }

    warn(message: string | object, ...args: unknown[]) {
        this.pushToQueue('warn', message, ...args);
    }

    error(message: string | object, ...args: unknown[]) {
        this.pushToQueue('error', message, ...args);
    }

    private shouldLog(targetLevel: LogLevel): boolean {
        return this.levels.indexOf(targetLevel) >= this.levels.indexOf(this.level);
    }

    private getTimestamp(): string {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    }

    private formatMessage(message: string | object): string {
        if (message instanceof Error) {
            return JSON.stringify({
                name: message.name,
                message: message.message,
                stack: message.stack,
                cause: message.cause
            });
        }
        if (typeof message === 'string') {
            return message;
        }
        try {
            return JSON.stringify(message, (_key, value) => {
                if (value instanceof Error) {
                    return {
                        name: value.name,
                        message: value.message,
                        stack: value.stack,
                        cause: value.cause
                    };
                }
                return value;
            });
        } catch {
            return String(message);
        }
    }

    private async flush() {
        if (this.flushing || this.queue.length === 0) return;
        this.flushing = true;

        const content = this.queue.join('');
        this.queue = [];

        if (isNode) {
            try {
                this.fsModule ??= await import('node:fs');
                this.fsModule.write(this.stdoutFd, content, (err: Error | null) => {
                    this.flushing = false;
                    if (err) {
                        process.stderr.write(`Logger Error: ${err.message}\n`);
                    }
                    if (this.queue.length > 0) {
                        setImmediate(() => this.flush());
                    }
                });
            } catch {
                process.stdout.write(content);
                this.flushing = false;
                if (this.queue.length > 0) {
                    setImmediate(() => this.flush());
                }
            }
        } else {
            console.log(content.trim());
            this.flushing = false;
            if (this.queue.length > 0) {
                setTimeout(() => this.flush(), 0);
            }
        }
    }

    private pushToQueue(level: LogLevel, message: string | object, ...args: unknown[]) {
        if (!this.shouldLog(level)) return;

        const timestamp = this.getTimestamp();
        let msgStr = this.formatMessage(message);

        if (args.length > 0) {
            const argsStr = args.map(arg => this.formatMessage(arg as string | object)).join(' ');
            msgStr = `${msgStr} ${argsStr}`;
        }

        const formatted = `${timestamp} [${level.toUpperCase()}]: ${msgStr}\n`;
        this.queue.push(formatted);

        if (!this.flushing) {
            if (isNode) {
                setImmediate(() => this.flush());
            } else {
                setTimeout(() => this.flush(), 0);
            }
        }
    }
}

export const logger = new AsyncLogger();