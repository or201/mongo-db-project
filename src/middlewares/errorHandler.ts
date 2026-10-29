import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({
        message: `error server: ${err}`,
    });
};
