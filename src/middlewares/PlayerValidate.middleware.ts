import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { logger } from "../config/logger.js";

export const validatePlayerRequest = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            logger.error(result.error.issues[0]?.message);
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        next();
    };
};

export const validatePlayerIdParamRequest = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            logger.error(result.error.issues[0]?.message);
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        Object.assign(req.params, result.data);
        next();
    };
};

export const validatePlayerQueryRequest = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            logger.error(result.error.issues[0]?.message);
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        Object.assign(req.query, result.data);
        next();
    };
};
