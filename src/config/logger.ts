import pino from "pino";

export const logger = pino({
    transport: {
        targets: [
            {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                    ignore: "pid,hostname",
                },
            },
            {
                target: "pino/file",
                options: {
                    destination: "./logs/app.log",
                    mkdir: true,
                },
            },
        ],
    },
});
