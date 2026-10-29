import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { logger } from "../config/logger.js";

type RequestSegment = "body" | "params" | "query";

export const validateRequest = (
    schema: z.ZodType,
    segment: RequestSegment = "body"
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[segment]);

        if (!result.success) {
            logger.error(result.error.issues[0]?.message);
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues,
            });
        }

        Object.assign(req[segment], result.data);

        next();
    };
};