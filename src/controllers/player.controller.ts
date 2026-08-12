import type { Request, Response } from "express";
import type { PlayerInput } from "../schemas/player.schema.js";
import { createPlayerService } from "../services/player.service.js";

export const createPlayerHandler = async (req: Request, res: Response) => {
    try {
        const { playerId, firstName, lastName, nationality, jerseyNumber, cost, team } = req.body as PlayerInput;
        const player = await createPlayerService(playerId, firstName, lastName, nationality, jerseyNumber, cost, team);
        
    } catch (error) {
        return res.status(500).json(`error server: ${error}`);
    }
};
