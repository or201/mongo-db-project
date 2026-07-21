import { type Request, type Response, type NextFunction } from "express";
import { z } from "zod";

export const validateTeamRequest = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues,
            });
        }
        next();
    };
};
export const validateTeamIdParamRequest = (schema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues,
            });
        }

        next();
    };
};
