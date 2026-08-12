import { ObjectId } from "mongodb";
import { createPlayer } from "../repositories/player.repository.js";
import { logger } from "../config/logger.js";
import type { Player } from "../models/player.model.js";

export const createPlayerService = async (
    playerId: number,
    firstName: string,
    lastName: string,
    nationality: string,
    jerseyNumber: number,
    cost: number,
    team: string
): Promise<Player | undefined> => {
    const player = await createPlayer(playerId, firstName, lastName, nationality, jerseyNumber, cost, team);
    try {
        const player = {
            playerId,
            firstName,
            lastName,
            nationality,
            jerseyNumber,
            cost,
            team: new ObjectId(team),
        };

        const insertPlayer = await createPlayer(playerId, firstName, lastName, nationality, jerseyNumber, cost, team)
        console.log(insertPlayer);
        
        logger.info(`add player successfully, ID: ${insertPlayer.playerId}`);
        return {
            _id: insertPlayer.insertedId,
            ...player,
        };
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Faild to createPlayer ${firstName} : ${error.message}`);
        } else {
            logger.error(`Failed to createPlayer: ${String(error)}`);
        }
        return undefined;
    }
};
