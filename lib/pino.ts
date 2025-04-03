import { type Logger, pino } from "pino";

export const logger: Logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
		},
	},
	level: "info",

	redact: [],
});
